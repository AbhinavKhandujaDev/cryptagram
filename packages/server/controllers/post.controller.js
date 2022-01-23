const { UserModel } = require("../models");

const {
  LikeModel,
  PostModel,
  BookmarkModel,
  CommentModel,
} = require("../models");

function matchAndGet(fieldsArray) {
  return { $match: { $expr: { $and: fieldsArray } } };
}

async function getAllPosts(req, res) {
  let username = req.params.username;

  try {
    let user = await UserModel.findOne({ username });

    let aggrs = [
      { $limit: 10 },
      {
        $lookup: {
          from: "likes",
          let: { pId: "$_id" },
          pipeline: [
            matchAndGet([
              { $eq: ["$from", req.user._id.toString()] },
              { $eq: ["$postId", "$$pId"] },
            ]),
          ],
          as: "liked",
        },
      },
      {
        $lookup: {
          from: "bookmarks",
          let: { pId: "$_id" },
          pipeline: [
            matchAndGet([
              { $eq: ["$from", req.user._id.toString()] },
              { $eq: ["$postId", { $toString: "$$pId" }] },
            ]),
          ],
          as: "bookmarked",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { pId: "$_id" },
          pipeline: [
            { $sort: { date: -1 } },
            matchAndGet([{ $eq: ["$postId", "$$pId"] }]),
            { $limit: 3 },
          ],
          as: "comments",
        },
      },
      {
        $addFields: {
          liked: { $in: ["$_id", "$liked.postId"] },
          bookmarked: { $in: [{ $toString: "$_id" }, "$bookmarked.postId"] },
        },
      },
      { $sort: { date: -1 } },
    ];
    if (user) {
      aggrs = [{ $match: { from: user._id.toString() } }, ...aggrs];
    }
    console.log("AGGREGATORS => ", aggrs);
    let posts = await PostModel.aggregate(aggrs);
    console.log(posts);
    res.status(200).send({ success: true, data: posts });
  } catch (error) {
    console.log("getAllPosts error => ", error);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

function createPost(req, res) {
  let body = req.body;
  let user = req.user;
  try {
    if ((!body.postUrl && !body.caption) || !body.postType) {
      throw new Error("Please send post url or caption with postType");
    }
    let obj = {
      from: user._id,
      fromName: user.username,
      date: Date.now(),
      postUrl: body.postUrl,
      postType: body.postType,
      caption: body.caption,
    };
    let post = new PostModel(obj);
    post.save();
    return res.send({ success: true, message: "post saved", data: post });
  } catch (error) {
    console.log("createPost error => ", error);
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
}

async function likePost(req, res) {
  let postId = req.params.id;
  let user = req.user;
  try {
    let post = await PostModel.findById(postId);
    let count = Number(post.likesCount);
    let model = new LikeModel({
      from: user._id,
      postId: postId,
      username: user.username,
      date: Date.now(),
    });
    await model.save();
    count += 1;
    await PostModel.findByIdAndUpdate(postId, {
      likesCount: count.toString(),
    });
    return res.send({ success: true, message: "successful" });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Unable to like post",
    });
  }
}

async function unlikePost(req, res) {
  let postId = req.params.id;
  let user = req.user;
  try {
    let post = await PostModel.findById(postId);
    let count = Number(post.likesCount);
    await LikeModel.findOneAndDelete({ from: user._id, postId });
    count -= 1;
    await PostModel.findByIdAndUpdate(postId, {
      likesCount: count.toString(),
    });
    return res.send({ success: true, message: "successful" });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Unable to unlike post",
    });
  }
}

async function bookmark(req, res) {
  try {
    let obj = {
      from: req.user._id.toString(),
      postId: req.params.postId,
    };
    await BookmarkModel.updateOne(
      { ...obj },
      { $set: { ...obj } },
      { upsert: true }
    );
    return res.send({ success: true, message: "successful" });
  } catch (error) {
    console.log("bookmarkPost error => ", error);
    return res.status(400).send({
      success: false,
      message: "Unable to bookmark post",
    });
  }
}

async function removeBookmark(req, res) {
  try {
    await BookmarkModel.findOneAndDelete({
      from: req.user._id.toString(),
      postId: req.params.postId,
    });
    return res.send({ success: true, message: "successful" });
  } catch (error) {
    console.log("bookmarkPost error => ", error);
    return res.status(400).send({
      success: false,
      message: "Unable to bookmark post",
    });
  }
}

async function postComment(req, res) {
  let postId = req.params.postId;
  try {
    let comment = new CommentModel({
      from: req.user._id,
      username: req.user.username,
      postId,
      comment: req.body.comment,
    });
    let data = await comment.save();
    return res.send({ success: true, message: "successful", data });
  } catch (error) {
    console.log("postComment error => ", error);
    return res.status(400).send({
      success: false,
      message: "Unable to add comment",
    });
  }
}

async function deleteComment(req, res) {
  let postId = req.params.postId;
  try {
    if (!req.body.cId) {
      return res.status(400).send({
        success: false,
        message: "Please provide comment id to remove",
      });
    }
    await CommentModel.findOneAndDelete({ _id: req.body.cId, postId });
  } catch (error) {
    console.log("deleteComment error => ", error);
    return res.status(400).send({
      success: false,
      message: "Unable to delete comment",
    });
  }
}

module.exports = {
  getAllPosts,
  createPost,

  likePost,
  unlikePost,

  bookmark,
  removeBookmark,

  postComment,
  deleteComment,
};
