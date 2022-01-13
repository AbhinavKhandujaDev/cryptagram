const { PostModel } = require("../models");

async function getAllPosts(req, res) {
  try {
    let query = req.params.id ? { from: req.params.id } : {};
    let posts = await PostModel.find(query);
    res.status(200).send({ success: true, data: posts });
  } catch (error) {
    console.log("getAllPosts error => ", error);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}
function savePost(req, res) {
  let body = req.body;
  if (!req.body.postUrl && req.body.caption) {
    return res.status(400).send({
      success: false,
      message: "Please send post url or caption",
    });
  }
  let obj = {
    from: "61d831b1337327f553562968",
    fromName: "Abhinav",
    date: Date.now(),
    postUrl: body.postUrl,
    postType: body.postType,
    caption: body.caption,
  };
  let post = new PostModel(obj);
  post.save();
  return res.send({ success: true, message: "post saved", data: post });
}

module.exports = {
  getAllPosts,
  savePost,
};
