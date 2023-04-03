const { encodeMsg, decodeMsg } = require("../helper/createMsg");
const Post = require("../models/post");
const User = require("../models/users");
const {postImage}= require('./fileUpload')
const multer  = require('multer')
const fs = require('fs');

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
      res.redirect("/dashboard?msg=" + encodeMsg(err));
    }
  },
  async doPost(req, res) {
    try {
        postImage.single('featuredimage')(req, res, async (err)=>{
          if (err instanceof multer.MulterError) {
              // console.log('Unknown error occurred while uploading')
              res.status(400).redirect(
                "/dashboard/posts?msg=" +
                  encodeMsg('Unknown error occurred while uploading')
              );
            } else if (err) {
              // console.log(err.message)
              res.status(400).redirect(
                "/dashboard/posts?msg=" +
                  encodeMsg(err.message)
              );
            }else{
              let id = req.body.id;
              console.log(id)
              if (id) {
                                // updating the post
                if(req.file.filename){
                  var oldimg = await Post.findById(id).select('image');
                  fs.unlinkSync(`public${oldimg.image}`);
                  await Post.findByIdAndUpdate(id, {image: req.file.filename, ...req.body});
                }
                else{
                await Post.findByIdAndUpdate(id, req.body);
                }
              } else {
                // Adding new post
              await Post({image: req.file.filename, ...req.body}).save();
            }
            return res.redirect(
              "/dashboard/posts?msg=" +
                encodeMsg(`Post ${id ? "Updated" : "Added"} Successfully.`)
            );
            }
      })

    } catch (err) {
      res.redirect("/dashboard?msg=" + encodeMsg(err.message, "danger"));
    }
  },
  async editPost(req, res) {
    let Id = req.params.id;
    if (!Id) {
      return res.redirect(
        "/posts?msg=" + encodeMsg("Post is required.", "danger")
      );
    }
    let post = await Post.findById(Id);
    let users = await User.find();

    res.render("dashboard/examples/post/add-post", {
      title: "Edit Post",
      post,
      users,
    });
  },
  async deletePost(req, res){
    let id  = req.params.id;
    if(!id){
      return res.redirect(
        "/posts?msg=" + encodeMsg("Post is required.", "danger")
      );
    }
    let post = await Post.findById(id);
    await Post.findByIdAndDelete(id);
    fs.unlinkSync(`public${post.image}`);
    return res.redirect('/dashboard/posts?msg=' + encodeMsg("Post deleted succesfully.", "success"));

  }
};
