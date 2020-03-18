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
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({'email': email}, (err, user) {
        if(err) {
            return done(err);
        }
        if(user) {
            return done(null, false, {message: 'Email is already in use.'});
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password = password;
    })
}));