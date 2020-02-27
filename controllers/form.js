const express = require('express');
const router = express.Router();

router.get("/registration", (req, res) => {
    res.render("form/registration", {
        title: `Registration Page`
    });
});

router.post("/registration", (req, res) => {
    const errors = [];
    if (req.body["reg-password"] != req.body["password-confirm"]) {
        errors.push(`*Password doesn't match!`)
    }
    if (errors.length > 0) {
        res.render("form/registration", {
            title: `Registration Page`,
            errorMessage: errors
        });
    } else {
        res.redirect("/");
    }
});

router.get("/login", (req, res) => {
    res.render("form/login", {
        title: `Login Page`
    });
});

router.post("/login", (req, res) => {
    const errors = [];

    res.redirect("/");
});

module.exports = router;