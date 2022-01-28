const mongoose = require("mongoose");

const SupportedPost = mongoose.Schema({
  from: { type: mongoose.SchemaTypes.String, required: true },
  postId: { type: mongoose.SchemaTypes.ObjectId, required: true },
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now(),
    required: true,
  },
  amount: { type: mongoose.SchemaTypes.String, required: true },
});

module.exports = new mongoose.model("SupportedPosts", SupportedPost);
