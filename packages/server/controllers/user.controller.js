const { UserModel } = require("../models");
const fbAdmin = require("firebase-admin");

async function createUser(req, res) {
  let authUser = req.user;
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
    let user = await UserModel.findOne({ username: req.params.username });
    let userData = {
      username: user.username,
      email: user.email,
      ethAddress: user.ethAddress,
      _id: user._id,
    };
    return res.send({ success: true, data: userData });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ success: false, message: "User not found" });
  }
}

async function update(req, res) {
  try {
    let userData = req.body;

    delete userData["username"];
    delete userData["email"];
    delete userData["authId"];

    let newUser = await UserModel.findByIdAndUpdate(req.user._id, {
      ...userData,
    });
    let data = {
      username: newUser.username,
      email: newUser.email,
      ethAddress: newUser.ethAddress,
    };
    return res.send({ success: true, message: "updated successfully", data });
  } catch (error) {
    console.log(error);
    return res.status(404).send({ success: false, message: "User not found" });
  }
}

module.exports = { getUser, createUser, update };
