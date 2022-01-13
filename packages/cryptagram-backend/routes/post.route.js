const express = require("express");

const router = express();

const { postController } = require("../controllers");

router.get("/:id?", postController.getAllPosts);
router.post("/", postController.savePost);

module.exports = router;
