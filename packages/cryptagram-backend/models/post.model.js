const mongoose = require("mongoose");

const Post = mongoose.Schema({
  from: { type: mongoose.SchemaTypes.String, required: true },
  fromName: { type: mongoose.SchemaTypes.String, required: true },
  date: { type: mongoose.SchemaTypes.String, required: true },
  postUrl: { type: mongoose.SchemaTypes.String },
  postType: { type: mongoose.SchemaTypes.String, required: true },
  caption: { type: mongoose.SchemaTypes.String },
});

module.exports = new mongoose.model("Post", Post);
