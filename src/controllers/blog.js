const { postImage } = require("./fileUpload");
const multer = require("multer")

module.exports = {
    async blog(req, res){
        try {
            res.render('blog', {
                title: 'Blog'
            })
        } catch (e) {
            console.log(e);
            res.redirect('/500');
        }
    },
    async postImage(req, res) {
        try {
            postImage(req, res, (err)=>{
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
            res.redirect('/500');
        }
    }
}