const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    documentId: {
      type: Number,
      max: 99999,
      require: true,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    content: {
      type: String,
    },
    documentSize: {
      type: Number,
      require: true,
      min: 1,
    },
    directory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directory",
      require: true,
      default: null,
    },
    tags: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
