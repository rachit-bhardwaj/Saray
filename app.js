if(process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

// Required package
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');

// required utils,routes,models
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js');
const User = require("./models/user.js");
const userRouter = require('./routes/user.js');
const { isLoggedIn } = require('./middleware.js');


// MongoDB connection
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
}
main()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log("Some error: " + err);
    });

// Use/Set differnt method of package
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

// MongoDB Atlas session -> connect-mongo
const storeSession = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

//if any error in storing 
storeSession.on('error', (error) =>{
    console.log("Error in MongoDB Session", error);
})

// session middleware or connect-flash
const sessionOptions = {
    storeSession,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash());

// passport -> password saved for whole session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// home route
app.get('/', (req, res, next) => {
    res.redirect('/listings');
});

// Session, connect-flash, userLogin/not middleware local variable
app.use((req, res, next) =>{
    res.locals.currUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

//connect router for listing, review, user
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);


app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;
    res.status(statusCode).render('./listings/error.ejs', { message });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log('Server is listening to port 8080');
});