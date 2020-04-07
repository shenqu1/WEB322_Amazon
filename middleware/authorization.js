const dashBoardLoader = (req, res) => {
    if (req.session.userInfo.type == "Admin") {
        res.render("User/clerkDashboard", {
            title: "Clerk Profile"
        });
    } else {
        res.render("User/userDashboard", {
            title: "User Profile"
        });
    }
}

module.exports = dashBoardLoader;