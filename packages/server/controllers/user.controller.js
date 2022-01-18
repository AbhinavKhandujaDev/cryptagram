const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;
const { UserModel } = require("../models");

async function getUser(req, res) {
  try {
    let user = await UserModel.findById(req.params.id);
    user = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
    };
    return res.send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ success: false, message: "User not found" });
  }
}

module.exports = {
  getUser,
};
