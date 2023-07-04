const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  postID: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  authorImage: {
    type: String,
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  parentID: {
    type: String,
    default: null,
  },
  depth: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Number,
    default: Date.now(),
  },
});

mongoose.model("comments", CommentSchema);
