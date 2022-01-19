const { UserModel } = require("../models");
const fbAdmin = require("firebase-admin");

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    console.log("No authorization token found");
    return res.status(403).send({ success: false, message: "forbidden" });
  }
  let idToken = req.headers.authorization.split(" ")[1];
  try {
    let decodedToken = await fbAdmin.auth().verifyIdToken(idToken);
    if (req.originalUrl === "/api/user/create") {
      req.user = await fbAdmin.auth().getUser(decodedToken.uid);
      return next();
    }
    req.user = await UserModel.find({ authId: decodedToken.uid });
    next();
  } catch (error) {
    console.log("auth error => ", error);
    return res
      .status(403)
      .send({ success: false, message: "Something went wrong" });
  }
};

module.exports = auth;
