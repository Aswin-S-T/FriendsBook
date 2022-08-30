const mongoose = require('mongoose')
const postSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    caption: { type: String },
    description: { type: String },
    image: { type: String },
    like: [],
    comment: [],
    share: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema)
module.exports = Post;