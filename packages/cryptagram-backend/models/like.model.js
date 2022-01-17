const mongoose = require("mongoose");

const Like = mongoose.Schema({
  postId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  from: { type: mongoose.SchemaTypes.String, required: true },
  username: { type: mongoose.SchemaTypes.String, required: true },
  date: { type: mongoose.SchemaTypes.String, required: true },
});

module.exports = new mongoose.model("Likes", Like);
