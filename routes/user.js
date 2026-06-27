const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsyc = require('../utils/wrapAsyc');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controller/user.js');
const user = require('../models/user.js');

// router.route -> signup
router.route('/signup')
    .get(userController.renderUserSignup)
    .post(wrapAsyc(userController.createNewUser));

// router.route -> Login -> tony__stark , 123
router.route('/login')
    .get(userController.renderUserLogin)
    .post(saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        userController.loginUser);

//Logout
router.get('/logout', userController.logoutUser);

module.exports = router;