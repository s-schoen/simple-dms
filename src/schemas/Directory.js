const mongoose = require("mongoose");

const DirectorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Directory",
    default: null,
    require: true,
  },
  children: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Directory",
      },
    ],
    default: [],
    require: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    immutable: true,
  },
});

const Directory = mongoose.model("Directory", DirectorySchema);

module.exports = Directory;
