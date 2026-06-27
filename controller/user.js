const User = require("../models/user.js");

// user signup form controller
module.exports.renderUserSignup = (req, res) => {
    res.render('./users/signup.ejs');
};

// Create new user controller
module.exports.createNewUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Saray!');
            res.redirect('/listings');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};

// Login User form controller
module.exports.renderUserLogin =  (req, res) => {
    res.render('users/login.ejs');
};

// Login User controller
module.exports.loginUser = async (req, res) => {
        req.flash('success', 'Welcome to Saray!');
        let redirectUrl = res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
    }

// Logout Usr controller
module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "You are logged out!");
        res.redirect('/listings');
    })
};