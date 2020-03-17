const express = require('express');
const router = express.Router();


router.get("/registration", (req, res) => {
    res.render("user/registration", {
        title: `Registration Page`
    });
});

router.post("/registration", (req, res) => {
    const errors = {
        title: `Registration Page`
    };

    errors.nameValue = req.body["reg-name"].trim();
    errors.emailValue = req.body["reg-email"].trim();
    errors.passwordValue = req.body["reg-password"].trim();
    errors.passwordMatch = req.body["password-confirm"].trim();

    if (errors.nameValue == "") {
        errors.name = `! Please enter your name`;
        errors.display = true;
    }

    if (errors.emailValue == "") {
        errors.email = `! Please enter email`;
        errors.display = true;
    } else if (/\s/.test(errors.emailValue)) {
        errors.email = `! Can not contain whitespace`;
        errors.display = true;
    } else if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(errors.emailValue))) {
        errors.email = `! Invalid email format`;
        errors.display = true;
    }

    if (errors.passwordValue == "") {
        errors.password = `! Please enter password `;
        errors.display = true;
    } else if (/\s/.test(errors.passwordValue)) {
        errors.password = `! Can not contain whitespace`;
        errors.display = true;
    } else if (!(/^[0-9a-zA-Z]+$/.test(errors.passwordValue)) && !(/.{6,12}/.test(errors.passwordValue))) {
        errors.password = `! Password must have 6 to 12 characters, letters and numbers only`;
        errors.display = true;
    } else if (!(/^[0-9a-zA-Z]+$/.test(errors.passwordValue))) {
        errors.password = `! Password must have letters and numbers only`;
        errors.display = true;
    } else if (!(/.{6,12}/.test(errors.passwordValue))) {
        errors.password = `! Password must have 6 to 12 characters`;
        errors.display = true;
    }

    if (errors.passwordMatch == "") {
        errors.match = `! Please enter password again `;
        errors.display = true;
    } else if (errors.passwordValue != errors.passwordMatch) {
        errors.match = `! Password doesn't match`
        errors.display = true;
    }
    if (errors.display) {
        res.render("user/registration", errors);
    } else {
        const dashboard = {
            title: "Dashboard",
            name: errors.nameValue,
            dash: true
        };
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        const msg = {
            to: `${req.body["reg-email"]}`,
            from: `squ7@myseneca.ca`,
            subject: `Registration Form Submit`,
            html: `<h1>Hi ${dashboard.name}!<br> Welcome to Amazon!</h1>
            <p>Congratulation! You have successfully registered with Amazon!</p>
            <p>Visit our website: <a href="https://web322-amazon-project.herokuapp.com/">https://web322-amazon-project.herokuapp.com/</a></p>`
        };
        sgMail.send(msg)
            .then(() => {
                res.render("user/dashboard", dashboard);
            })
            .catch(err => {
                console.log(`Error ${err}`);
            })
    }
});

router.get("/login", (req, res) => {
    res.render("user/login", {
        title: `Login Page`
    });
});

router.post("/login", (req, res) => {
    const errors = {
        title: `Login Page`,
    };
    errors.emailValue = req.body["log-email"].trim();
    errors.passwordValue = req.body["log-password"].trim();

    if (errors.emailValue == "") {
        errors.email = `! Please enter email`;
        errors.display = true;
    } else if (/\s/.test(errors.emailValue)) {
        errors.email = `! Can not contain whitespace`;
        errors.display = true;
    }

    if (errors.passwordValue == "") {
        errors.password = `! Please enter password`;
        errors.display = true;
    } else if (/\s/.test(errors.passwordValue)) {
        errors.password = `! Can not contain whitespace`;
        errors.display = true;
    }

    if (errors.display) {
        res.render("user/login", errors);
    } else {
        res.render("user/clerkDashboard", {
            title: `Clerk Dashboard`
        });
    }

});

module.exports = router;