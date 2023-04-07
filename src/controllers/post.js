const { encodeMsg, decodeMsg } = require("../helper/createMsg");
const Post = require("../models/post");
const User = require("../models/users");
const { postImage } = require("./fileUpload");
const multer = require("multer");
const fs = require("fs");

module.exports = {
  async allPosts(req, res) {
    try {
      let msgToken = req.query.msg;
      let option = {};
      if (msgToken) {
        let msg = decodeMsg(msgToken);
        option = msg;
      }
      let posts = await Post.find().populate("author");
      res.render("dashboard/examples/post/posts", {
        title: "Posts",
        posts,
        toast: Object.keys(option).length == 0 ? undefined : option,
      });
    } catch (err) {
      res.redirect("/dashboard?msg=" + encodeMsg(err));
    }
  },
  async addPost(req, res) {
    try {
      let users = await User.find();
      res.render("dashboard/examples/post/add-post", {
        title: "Add Post",
        users,
      });
    } catch (err) {
      res.redirect("/dashboard?msg=" + encodeMsg(err.message));
    }
  },
  async doPost(req, res) {
    try {
      postImage.any()(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
          res
            .status(400)
            .redirect(
              "/dashboard/posts?msg=" +
                encodeMsg("Unknown error occurred while uploading", "danger")
            );
        } else if (err) {
          res
            .status(400)
            .redirect(
              "/dashboard/posts?msg=" + encodeMsg(err.message, "danger")
            );
        } else {
          let id = req.body.id;
          let featuredimg = req.files.findIndex(
            (e) => e.fieldname == "featuredimage"
          );
          if (id) {
            // updating the post
            if (req.files[featuredimg]?.filename) {
              var oldimg = await Post.findById(id).select("image");
              fs.unlinkSync(`public${oldimg.image}`);
              await Post.findByIdAndUpdate(id, {
                image: req.files[featuredimg].filename,
                ...req.body,
              });
            } else {
              await Post.findByIdAndUpdate(id, req.body);
            }
          } else {
            // Adding new post
            await Post({
              image: req.files[featuredimg].filename,
              ...req.body,
            }).save();
          }
          return res.redirect(
            "/dashboard/posts?msg=" +
              encodeMsg(`Post ${id ? "Updated" : "Added"} Successfully.`)
          );
        }
      });
    } catch (err) {
      res.redirect("/dashboard?msg=" + encodeMsg(err.message, "danger"));
    }
  },
  async editPost(req, res) {
    try {
      let Id = req.params.id;
      if (!Id) {
        return res.redirect(
          "/dashboard/posts?msg=" + encodeMsg("Post is required.", "danger")
        );
      }
      let post = await Post.findById(Id);
      if (!post) {
        return res.redirect(
          "/dashboard/posts?msg=" + encodeMsg("Post not found.", "danger")
        );
      }
      let users = await User.find();

      res.render("dashboard/examples/post/add-post", {
        title: "Edit Post",
        post,
        users,
      });
    } catch (error) {
      res.redirect("/dashboard?msg=" + encodeMsg(error.message,'danger'));
    }
  },
  async deletePost(req, res) {
    try {
      let id = req.params.id;
      if (!id) {
        return res.redirect(
          "/dashboard/posts?msg=" + encodeMsg("Post is required.", "danger")
        );
      }
      let post = await Post.findById(id);
      if (!post) {
        return res.redirect(
          "/dashboard/posts?msg=" + encodeMsg("Post not found.", "danger")
        );
      }
      await Post.findByIdAndDelete(id);
      if (fs.existsSync(`public${post.image}`)) {
        fs.unlink(`public${post.image}`, (err) => {
          console.log(err);
        });
      }
      return res.redirect(
        "/dashboard/posts?msg=" +
          encodeMsg("Post deleted successfully.", "success")
      );
    } catch (error) {
      res.redirect("/dashboard?msg=" + encodeMsg(error.message,'danger'));
    }
  },
};
