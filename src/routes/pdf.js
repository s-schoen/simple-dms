const errors = require("restify-errors");
const jwt = require("../util/jwt");
const files = require("../util/files");

module.exports = (server) => {
  server.get("/api/pdf/:docId", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    if (!files.documentExists(userId, req.params.docId)) {
      next(
        new errors.NotFoundError(
          `No file stored for document id ${req.params.docId}`
        )
      );
    }

    const filename = `${req.params.docId.padStart(5, "0")}.pdf`;

    // serve pdf file
    res.writeHead(200, {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": "attachment; filename=" + filename,
    });

    files.getDocumentReadStream(userId, req.params.docId).pipe(res);
  });

  server.get("/api/pdf/:docId/thumbnail", async (req, res, next) => {
    const userId = jwt.getUserId(req);

    if (!files.documentExists(userId, req.params.docId)) {
      next(
        new errors.NotFoundError(
          `No file stored for document id ${req.params.docId}`
        )
      );
    }

    try {
      const filename = `${req.params.docId.padStart(5, "0")}.png`;

      // serve thumbnail
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=" + filename,
      });

      files.getThumbnailReadStream(userId, req.params.docId).pipe(res);
    } catch (error) {
      console.error("Error at pdf thumbnail GET", error);
      next(new errors.InternalServerError(error));
    }
  });
};
