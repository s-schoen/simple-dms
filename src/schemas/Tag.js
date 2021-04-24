const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  color: {
    type: String,
    match: [/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/, "Invalid HTML color code"],
    default: "#ababab",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    immutable: true,
  },
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
