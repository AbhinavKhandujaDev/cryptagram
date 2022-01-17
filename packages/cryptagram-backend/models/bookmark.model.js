const mongoose = require("mongoose");

const Bookmark = mongoose.Schema({
  from: { type: mongoose.SchemaTypes.String, required: true },
  postId: { type: mongoose.SchemaTypes.String, required: true },
});

module.exports = new mongoose.model("Bookmarks", Bookmark);
