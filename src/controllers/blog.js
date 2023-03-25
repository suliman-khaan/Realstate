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
    }
}