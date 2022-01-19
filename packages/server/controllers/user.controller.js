const mongoose = require("mongoose");
// const ObjectId = mongoose.Types.ObjectId;
const { UserModel } = require("../models");
const fbAdmin = require("firebase-admin");

async function createUser(req, res) {
  let authUser = req.user;
  console.log("USER => ", authUser);
  try {
    let user = new UserModel({
      username: authUser.displayName,
      email: authUser.email,
      authId: authUser.uid,
    });
    let saveduser = await user.save();
    return res.send({ success: true, data: saveduser });
  } catch (error) {
    console.log(error);
    fbAdmin.auth().deleteUser(authUser.uid);
    return res
      .status(404)
      .send({ success: false, message: "Unable to save user" });
  }
}
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
  createUser,
};
