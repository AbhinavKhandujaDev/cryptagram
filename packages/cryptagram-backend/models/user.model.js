const mongoose = require("mongoose");
const UserModel = new mongoose.Schema({
  name: { type: mongoose.Schema.Types.String },
  username: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});
module.exports = mongoose.model("Users", UserModel);
