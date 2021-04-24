const errors = require("restify-errors");
const Tag = require("../schemas/Tag");
const Document = require("../schemas/Document");
const jwt = require("../util/jwt");

const toResponse = (t) => {
  return {
    id: t._id,
    name: t.name,
    description: t.description || "",
    color: t.color,
  };
};

module.exports = (server) => {
  // get all tags for current user
  server.get("/api/tags", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    try {
      const tags = Tag.find({ user: userId });
      res.send(tags.map((t) => toResponse(t)));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // insert new tag
  server.post("/api/tags", async (req, res, next) => {
    req.accepts("application/json");

    const userId = jwt.getUserId(req);
    const newTag = new Tag(req.body);
    newTag.user = userId;

    try {
      const insertedTag = await newTag.save();
      res.send(201, toResponse(insertedTag));
      console.log(
        `Created new tag for user ${userId}`,
        toResponse(insertedTag)
      );
      next();
    } catch (error) {
      if (error.name === "ValidationError") {
        return next(new errors.BadRequestError(error));
      }
      return next(new errors.InternalServerError(error));
    }
  });

  // update tag by id
  server.put("/api/tags/:id", async (req, res, next) => {
    req.accepts("application/json");

    const userId = jwt.getUserId(req);
    const update = req.body;
    delete update._id;
    delete update.user;

    try {
      const tagToUpdate = await Tag.findById(req.params.id);

      if (tagToUpdate === null) {
        next(
          new errors.ResourceNotFoundError(`No tag with id ${req.params.id}`)
        );
      }

      if (tagToUpdate.user !== userId) {
        next(
          new errors.UnauthorizedError(`No permission for tag ${req.params.id}`)
        );
      }

      const updatedTag = await Tag.findOneAndUpdate(
        { _id: req.param.id },
        update,
        { new: true }
      );

      res.send(toResponse(updatedTag));
      console.log(`User ${userId} updated tag`, toResponse(updatedTag));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  server.del("/api/tags/:id", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    try {
      const tagToDelete = await Tag.findById(req.params.id);

      if (tagToDelete === null) {
        next(
          new errors.ResourceNotFoundError(`No tag with id ${req.params.id}`)
        );
      }

      if (tagToDelete.user !== userId) {
        next(
          new errors.UnauthorizedError(`No permission for tag ${req.params.id}`)
        );
      }

      const deletedTag = await Tag.findOneAndRemove({ _id: req.params.id });

      // remove tag from documents
      await Document.updateMany({}, { $pullAll: { tags: [req.params.id] } });

      res.send(toResponse(deletedTag));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });
};
