module.exports.Isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.user); 
        req.flash("error", "You must log in first");
        return res.redirect("/login"); 
    }
    next();
}
