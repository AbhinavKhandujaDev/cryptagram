const express = require("express");

const router = express();

const { userController } = require("../controllers");

router.get("/:id", userController.getUser);

module.exports = router;