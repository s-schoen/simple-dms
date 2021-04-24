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

DirectorySchema.pre("remove", (next) => {
  const dir = this;

  // delete directory from documents
  dir.model("Document").updateMany({ directory: dir._id }, { directory: null });

  if (dir.parent !== null) {
    // remove from parent
    dir
      .model("Directory")
      .update({ _id: dir.parent }, { $pullAll: { children: [dir._id] } });
  }

  // remove child directories
  for (const childId in dir.children) {
    dir.model("Directory").remove({ _id: childId });
  }

  next();
});

const Directory = mongoose.model("Directory", DirectorySchema);

module.exports = Directory;
