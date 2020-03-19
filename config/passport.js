const passport = require('passport');
const User = require('../model/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use('local.registration', new LocalStrategy({
    usernameField: "reg-email",
    passwordField: "reg-password",
    passReqToCallback: true
}, (req, username, password, done) => {
    const messages = [];
    const nameValue = req.body["reg-name"].trim();
    const emailValue = req.body["reg-email"].trim();
    const passwordValue = req.body["reg-password"].trim();
    const passwordMatch = req.body["password-confirm"].trim();

    if (nameValue == "") {
        messages.push(`! Please enter your name`);
    }

    if (emailValue == "") {
        messages.push(`! Please enter email`);
    } else if (!(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(emailValue))) {
        messages.push(`! Invalid email format`);
    }

    if (passwordValue == "") {
        messages.push(`! Please enter password `);
    } else if (/\s/.test(passwordValue)) {
        messages.push(`! Can not contain whitespace`);
    } else if (!(/^[0-9a-zA-Z]+$/.test(passwordValue)) && !(/.{6,12}/.test(passwordValue))) {
        messagaes.push(`! Password must have 6 to 12 characters, letters and numbers only`);

    } else if (!(/^[0-9a-zA-Z]+$/.test(passwordValue))) {
        messages.push(`! Password must have letters and numbers only`);
    } else if (!(/.{6,12}/.test(passwordValue))) {
        messages.push(`! Password must have 6 to 12 characters`);
    }

    if (passwordValue != passwordMatch) {
        messages.push(`! Password doesn't match`);
    }
    if(messages.length > 0) {
        return done(null, false, req.flash('error', messages));
    }


    User.findOne({'email': username}, (err, user)=>{
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, false, {message: 'Email is already in use.'});
        }
        const newUser = new User();
        newUser.name = req.body["reg-name"];
        newUser.email = username;
        newUser.password = newUser.encryptPassword(password);
        newUser.save((err, result)=>{
            if(err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));