function admin(req, res, next){
    debugger
    if(req.isAuthenticated() && req.user.role === 'admin'){
        return next()
    }
    return res.redirect('/')
}

module.exports = admin
