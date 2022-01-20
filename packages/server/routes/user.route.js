const express = require("express");

const router = express();

const { userController } = require("../controllers");

router.get("/:username", userController.getUser);
router.post("/create", userController.createUser);

module.exports = router;
