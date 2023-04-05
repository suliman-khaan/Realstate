const { postImage } = require("./fileUpload");
const multer = require("multer");
const Post = require('../models/post');

module.exports = {
    async blog(req, res){
        try {
            let blogPosts = await Post.find({status: 'publish'}).populate({path: 'author', select: ['name', 'avatar']})
            res.render('blog', {
                title: 'Blog',
                blogPosts
            })
        } catch (e) {
            res.redirect('/blog');
        }
    },
    async postImage(req, res) {
        try {
            postImage.array('image[]', 2)(req, res, (err)=>{
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_COUNT') {
                        res.status(400).json('You can upload upto 2 maximum files');
                        return;
                      }
                    res.status(400).json('Unknown error occurred while uploading')
                  } else if (err) {
                    res.status(400).json(err.message)
                }else{
                    res.status(200).json(req.files)
                }
            })
        } catch (error) {
            console.log(e);
            res.status(500).json(err.message)
        }
    },
    async singlePost(req, res){
        try {
            let id = req.params.id;
            if(!id) return res.redirect('/blog')
            let postData = await Post.findById(id).populate({path: 'author', select: ['name', 'avatar']});
            if(postData){
                return res.render('dashboard/examples/post/singlePost', {
                    title: 'Single Post',
                    postData
                })
            }
            return res.redirect('/blog');
        } catch (error) {
            res.redirect('/blog');
        }
    }
}