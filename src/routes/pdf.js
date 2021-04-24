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
};
