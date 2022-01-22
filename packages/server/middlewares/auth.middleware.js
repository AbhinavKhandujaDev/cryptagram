const { UserModel } = require("../models");
const fbAdmin = require("firebase-admin");

const auth = async (req, res, next) => {
  console.log("Authenticating");
  if (!req.headers.authorization) {
    console.log("Authentication token available");
    return res.status(403).send({ success: false, message: "forbidden" });
  }
  let idToken = req.headers.authorization.split(" ")[1];
  
  try {
    let decodedToken = await fbAdmin.auth().verifyIdToken(idToken);
    if (req.originalUrl === "/api/user/create") {
      req.user = await fbAdmin.auth().getUser(decodedToken.uid);
      return next();
    }
    req.user = await UserModel.findOne({ authId: decodedToken.uid });
    console.log("Authentication passed");
    next();
  } catch (error) {
    let message = "forbidden";
    let status = 403;
    if (error.code === "auth/id-token-expired") {
      message = "ID token expired";
      status = 401;
    }
    console.log("auth error => ", error);
    return res.status(status).send({ success: false, message: message });
  }
};

module.exports = auth;
