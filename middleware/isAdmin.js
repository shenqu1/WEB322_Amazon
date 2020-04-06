const isAdmin = (req, res, next) => {
    if (req.session.userInfo.type == "Admin") {
        next();
    } else {
        res.redirect("/");
    }
}

module.exports = isAdmin;