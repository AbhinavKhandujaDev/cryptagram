const express = require("express");

const router = express();

const { postController } = require("../controllers");

router.get("/:username?", postController.getAllPosts);

router.post("/like/:id", postController.likePost);
router.delete("/like/:id", postController.unlikePost);

router.post("/bookmark/:postId", postController.bookmark);
router.delete("/bookmark/:postId", postController.removeBookmark);

router.post("/support", postController.supportPost);

router.post("/comment/:postId", postController.postComment);
router.delete("/comment/:postId", postController.deleteComment);

router.post("/", postController.createPost);

module.exports = router;
