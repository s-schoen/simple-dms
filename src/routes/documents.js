const errors = require("restify-errors");
const Document = require("../schemas/Document");
const jwt = require("../util/jwt");
const files = require("../util/files");

const toResponse = (d) => {
  return {
    id: d.documentId,
    title: d.title,
    description: d.description || "",
    content: d.content || "",
    author: d.author || "",
    documentSize: d.documentSize,
    directory: d.directory,
    tags: d.tags,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
};

module.exports = (server) => {
  // get all documents for current user
  server.get("/api/docs/", async (req, res, next) => {
    const userId = jwt.getUserId(req);
    try {
      const docs = await Document.find({ user: userId });
      res.send(docs.map((d) => toResponse(d)));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // get document by document id
  server.get("/api/docs/:docId", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    try {
      const doc = await Document.findOne({
        $and: [{ user: userId }, { documentId: req.params.docId }],
      });

      if (doc === null) {
        next(
          new errors.ResourceNotFoundError(
            `No document with id ${req.params.docId}`
          )
        );
      }

      res.send(toResponse(doc));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // insert new document
  server.post("/api/docs", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    // check file
    if (!req.files.pdf || req.files.pdf.type !== "application/pdf") {
      next(new errors.BadRequestError("Invalid file"));
    }

    const newDoc = new Document(JSON.parse(req.params.data));
    newDoc.user = userId;
    newDoc.documentSize = req.files.pdf.size;

    try {
      // get current highest documentId for the user
      const currentMaxDocId = await Document.find({ user: userId })
        .sort({ documentId: -1 })
        .limit(1);

      newDoc.documentId = currentMaxDocId === null ? 1 : currentMaxDocId + 1;

      const insertedDoc = await newDoc.save();

      // store file
      files.storeDocumentFile(
        req.files.pdf.path,
        userId,
        insertedDoc.documentId
      );

      res.send(201, toResponse(insertedDoc));
      console.log(
        `User ${userId} created new document`,
        toResponse(insertedDoc)
      );
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  // update document by document id
  server.put("/api/docs/:docId", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    // check file type of data of supplied
    if (req.files.pdf && req.files.pdf.type !== "application/pdf") {
      next(
        new errors.BadRequestError(
          "Invalid file type. Only PDF files are supported"
        )
      );
    }

    const update = JSON.parse(req.params.data);
    delete update.user;
    delete update._id;
    delete update.documentId;

    try {
      const docToUpdate = await Document.findOne({
        $and: [{ user: userId }, { documentId: req.params.docId }],
      });

      if (docToUpdate === null) {
        next(
          new errors.ResourceNotFoundError(
            `No document with id ${req.params.docId}`
          )
        );
      }

      // store file if supplied
      if (req.files.pdf) {
        update.documentSize = req.files.pdf.size;
        files.storeDocumentFile(req.files.pdf.path, userId, docToUpdate.params);
      }

      const updatedDoc = await Document.findOneAndUpdate(
        {
          $and: [{ user: userId }, { documentId: req.params.docId }],
        },
        update,
        { new: true }
      );

      res.send(toResponse(updatedDoc));
      console.log(`User ${userId} updated document`, toResponse(updatedDoc));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });

  server.del("/api/docs/:docId", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    try {
      const docToDelete = await Document.findOne({
        $and: [{ user: userId }, { documentId: req.params.docId }],
      });

      if (docToDelete === null) {
        next(
          new errors.ResourceNotFoundError(
            `No document with id ${req.params.docId}`
          )
        );
      }

      const deletedDoc = await Document.findOneAndRemove({
        $and: [{ user: userId }, { documentId: req.params.docId }],
      });

      // delete file
      files.deleteDocument(userId, deletedDoc.documentId);

      res.send(toResponse(deletedDoc));
      console.log(`User ${userId} deleted document`, toResponse(deletedDoc));
      next();
    } catch (error) {
      next(new errors.InternalServerError(error));
    }
  });
};
