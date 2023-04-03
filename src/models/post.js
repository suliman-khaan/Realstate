const moment = require("moment");
const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: String,
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image:{
      type: String,
      get: function (img) {
        if (img) return `/images/posts/${img}`;
      },
    },
    status: String,
  },
  {
    timestamps: true,
  }
);
postSchema.path("createdAt").get(function (date) {
  return moment(date).format("MMMM Do YYYY, h:mm a");
});
let Post = mongoose.model("Post", postSchema);
module.exports = Post;
