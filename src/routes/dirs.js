const errors = require("restify-errors");
const Directory = require("../schemas/Directory");
const jwt = require("../util/jwt");

const toResponse = (d) => {
  return {
    id: d._id,
    name: d.name,
    description: d.description,
    parent: d.parent,
    children: d.children,
  };
};

module.exports = (server) => {
  // get all directories of current user
  server.get("/api/dirs", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    try {
      const dirs = await Directory.find({ user: userId });
      res.send(dirs.map((d) => toResponse(d)));
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // insert new directory
  server.post("/api/dirs", async (req, res, next) => {
    req.accepts("application/json");

    const newDir = new Directory(req.body);
    delete newDir.children;

    newDir.user = jwt.getUserId(req);

    try {
      let parent = null;

      // check if parent is valid
      if (newDir.parent !== null) {
        parent = await Directory.findById(newDir.parent);

        if (parent === null) {
          next(
            new errors.InvalidArgumentError(
              `Parent directory with id ${newDir.parent} does not exist`
            )
          );
        }
      }

      const insertedDir = await newDir.save();

      if (parent !== null) {
        // add this dir to children of parent
        parent.children = [...parent.children, newDir._id];
        await parent.save();
      }

      res.send(201, toResponse(insertedDir));
      console.log(
        `Create new directory for user ${jwt.getUserId(req)}`,
        toResponse(insertedDir)
      );
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // update directory by id
  server.put("/api/dirs/:id", async (req, res, next) => {
    req.accepts("application/json");

    const update = req.body;
    delete update._id;
    delete update.user;
    delete update.children;

    const userId = jwt.getUserId(req);

    try {
      const dirToUpdate = await Directory.findById(req.params.id);

      if (dirToUpdate === null) {
        next(
          new errors.ResourceNotFoundError(
            `No directory with id ${req.params.id}`
          )
        );
      }

      if (dirToUpdate.user !== userId) {
        next(
          new errors.UnauthorizedError(
            `No permission for directory ${req.params.id}`
          )
        );
      }

      // check if parent is valid
      let parent = null;
      if (update.parent !== null) {
        parent = await Directory.findById(update.parent);

        if (parent === null) {
          next(
            new errors.InvalidArgumentError(
              `Parent directory with id ${update.parent} does not exist`
            )
          );
        }
      }

      // update directory
      const updatedDirectory = await Directory.findOneAndUpdate(
        { _id: req.params.id },
        update,
        { new: true }
      );

      if (parent !== null) {
        // add this dir to children of parent
        parent.children = [...parent.children, updatedDirectory._id];
        await parent.save();
      }

      // respond with update
      res.send(toResponse(updatedDirectory));
      console.log(
        `Updated directoy ${req.params.id}`,
        toResponse(updatedDirectory)
      );
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // delete directory by id
  server.del("/api/dirs/:id", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    try {
      const dirToDelete = await Directory.findById(req.params.id);

      if (dirToDelete === null) {
        next(
          new errors.ResourceNotFoundError(
            `No directory with id ${req.params.id}`
          )
        );
      }

      if (dirToDelete.user !== userId) {
        next(
          new errors.UnauthorizedError(
            `No permission for directory ${req.params.id}`
          )
        );
      }

      if (dirToDelete.children.length > 0) {
        // delete all children
        // TODO: recursively
        await Directory.deleteMany({ _id: { $in: dirToDelete.children } });
      }

      const deletedDir = await Directory.findOneAndRemove({
        _id: req.params.id,
      });

      res.send(toResponse(deletedDir));
      console.log(`Deleted directory ${req.params.id}`, toResponse(deletedDir));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });
};
