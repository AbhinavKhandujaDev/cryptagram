const mongoose = require("mongoose");

const Comment = mongoose.Schema({
  postId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  from: { type: mongoose.SchemaTypes.String, required: true },
  username: { type: mongoose.SchemaTypes.String, required: true },
  comment: { type: mongoose.SchemaTypes.String, required: true },
  date: {
    type: mongoose.SchemaTypes.String,
    required: true,
    default: Date.now(),
  },
});

module.exports = new mongoose.model("Comments", Comment);
