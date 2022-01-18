const { UserModel } = require("../models");

const auth = async (req, res, next) => {
  req.user = await UserModel.findById("61d831b1337327f553562968");
  next();
};

module.exports = auth;
