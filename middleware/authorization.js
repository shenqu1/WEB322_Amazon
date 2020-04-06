const dashBoardLoader = (req, res) => {
    if (req.session.userInfo.type == "Admin") {
        res.render("user/clerkDashboard", {
            title: "Clerk Profile"
        });
    } else {
        res.render("user/userDashboard", {
            title: "User Profile"
        });
    }
}

module.exports = dashBoardLoader;