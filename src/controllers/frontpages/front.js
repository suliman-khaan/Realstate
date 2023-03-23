module.exports = {
    async home(req, res){
        res.render('frontpages/home', {
            title: 'Home'
        })
    },
    async about(req, res){
        res.render('frontpages/about', {
            title: 'About'
        })
    },
    async feature(req, res){
        res.render('frontpages/features', {
            title: 'Features'
        })
    },
    async pricing(req, res){
        res.render('frontpages/pricing', {
            title: 'Pricing'
        })
    },
    async blog(req, res){
        res.render('frontpages/blog', {
            title: 'Blog'
        })
    }
}