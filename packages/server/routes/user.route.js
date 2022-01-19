const express = require("express");

const router = express();

const { userController } = require("../controllers");

router.get("/:id", userController.getUser);
router.post("/create", userController.createUser);

module.exports = router;
