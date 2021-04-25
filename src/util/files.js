const config = require("../config");
const fs = require("fs");
const path = require("path");
const PDFImage = require("pdf-image").PDFImage;

module.exports = {
  /**
   * Copies a file to the data directory
   * @param {String} documentPath path where the document file is currently located
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   */
  storeDocumentFile: function (documentPath, userId, documentId) {
    // create user directory if not exists
    if (!fs.existsSync(path.join(config.DATA_DIRECTORY, userId))) {
      fs.mkdirSync(path.join(config.DATA_DIRECTORY, userId));
    }

    // copy file
    fs.copyFileSync(
      documentPath,
      path.join(config.DATA_DIRECTORY, userId, `${documentId}.pdf`)
    );

    // generate thumbnail
    this.generateThumbnailAsync(userId, documentId);
  },
  /**
   * Gets the path for a stored document by user id and document id
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   * @returns the path to the stored file
   */
  getDocumentPath: function (userId, documentId) {
    return path.join(config.DATA_DIRECTORY, userId, `${documentId}.pdf`);
  },
  /**
   * Gets a ReadStream for a stored document by user id and document id
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   * @returns ReadStream for the stored file
   */
  getDocumentReadStream: function (userId, documentId) {
    return fs.createReadStream(
      path.join(config.DATA_DIRECTORY, userId, `${documentId}.pdf`)
    );
  },
  /**
   * Removes the file for a document
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   */
  deleteDocument: function (userId, documentId) {
    // delete document
    fs.rmSync(this.getDocumentPath(userId, documentId));

    // delete thumbnail
    fs.rmSync(
      path.join(config.DATA_DIRECTORY, userId, "previews", `${documentId}.png`)
    );
  },
  /**
   * Checks if a document is stored
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   * @returns true if the document exists, false otherwise
   */
  documentExists: function (userId, documentId) {
    return fs.existsSync(
      path.join(config.DATA_DIRECTORY, userId, `${documentId}.pdf`)
    );
  },
  /**
   * Generates a png thumbnail for the given document asynchronously
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   */
  generateThumbnailAsync: function (userId, documentId) {
    // create previews directory if not exists
    if (!fs.existsSync(path.join(config.DATA_DIRECTORY, userId, "previews"))) {
      fs.mkdirSync(path.join(config.DATA_DIRECTORY, userId, "previews"));
    }

    const img = new PDFImage(
      path.join(config.DATA_DIRECTORY, userId, `${documentId}.pdf`)
    );

    img
      .convertPage(0)
      .then((resPath) => {
        // copy to previews directory
        fs.renameSync(
          resPath,
          path.join(
            config.DATA_DIRECTORY,
            userId,
            "previews",
            `${documentId}.png`
          )
        );
      })
      .catch((error) => {
        console.error(
          `Could not generate thumbnail for document ${documentId}`,
          error
        );
      });
  },
  /**
   * Gets the path for the thumbnail of a document
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   * @returns the path to the thumbnail image
   */
  getThumbnailPath: function (userId, documentId) {
    return path.join(
      config.DATA_DIRECTORY,
      userId,
      "previews",
      `${documentId}.png`
    );
  },
  /**
   * Gets a ReadStream for a stored document thumbnail by user id and document id
   * @param {String} userId ID of the owner
   * @param {Number} documentId ID of the document
   * @returns ReadStream for the stored thumbnail
   */
  getThumbnailReadStream: function (userId, documentId) {
    return fs.createReadStream(this.getThumbnailPath(userId, documentId));
  },
};
