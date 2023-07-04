const mongoose = require("mongoose");

const Post = mongoose.model("posts");

const fetchAllPosts = async (req, res, next) => {
  const posts = await Post.find({});
  res.locals.posts = posts;
  next();
};

module.exports = {
  fetchAllPosts,
};
