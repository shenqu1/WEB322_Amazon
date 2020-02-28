const express = require('express');
const router = express.Router();

router.get("/registration", (req, res) => {
    res.render("form/registration", {
        title: `Registration Page`
    });
});

router.post("/registration", (req, res) => {
    const errors = {
        title: `Login Page`
    };

    errors.nameValue = req.body["reg-name"];
    errors.emailValue = req.body["reg-email"];
    errors.passwordValue = req.body["reg-password"];
    errors.passwordMatch = req.body["password-confirm"];

    if (req.body["reg-name"] == "") {
        errors.name = `! Please enter your name`;
        errors.display = true;
    }

    if (req.body["reg-email"] == "") {
        errors.email = `! Please enter email`;
        errors.display = true;
    } else if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(req.body["reg-email"]))) {
        errors.email = `! Invalid email format`;
        errors.display = true;
    }

    if (req.body["reg-password"] == "") {
        errors.password = `! Please enter password `;
        errors.display = true;
    } else if (!(/^[0-9a-zA-Z]+$/.test(req.body["reg-password"])) && !(/.{6,12}/.test(req.body["reg-password"]))) {
        errors.password = `! Password must have 6 to 12 characters, letters and numbers only`;
        errors.display = true;
    } else if (!(/^[0-9a-zA-Z]+$/.test(req.body["reg-password"]))) {
        errors.password = `! Password must have letters and numbers only`;
        errors.display = true;
    } else if (!(/.{6,12}/.test(req.body["reg-password"]))) {
        errors.password = `! Password must have 6 to 12 characters`;
        errors.display = true;
    }


    if (req.body["reg-password"] != req.body["password-confirm"]) {
        errors.match = `! Password doesn't match`
        errors.display = true;
    }
    if (errors.display) {
        res.render("form/registration", errors);
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
    const errors = {
        title: `Login Page`,
    };
    errors.emailValue = req.body["log-email"];
    errors.passwordValue = req.body["log-password"];

    if (req.body["log-email"] == "") {
        errors.email = `! Please enter email`;
        errors.display = true;
    }

    if (req.body["log-password"] == "") {
        errors.password = `! Please enter password`;
        errors.display = true;
    }

    if (errors.display) {
        res.render("form/login", errors);
    } else {
        res.redirect("/");
    }

});

module.exports = router;