exports.isAuth = (req,res,next) => {
    if(!req.session.logged){
        return res.redirect('/login');
    }
    next();
}