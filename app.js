var express = require("express"),
     app = express(),
     bodyParser = require("body-parser"),
     mongoose = require('mongoose'),
     Campground = require('./models/campground.js'),
     Comment = require("./models/comment"),
     methodOverride = require('method-override'),
     User = require("./models/user"),
     passport = require('passport'),
     passportLocal = require('passport-local');
     var flash   = require('connect-flash');



      
app.use(flash());
var index = require('./views/routes/index.js'),     
    comments = require('./views/routes/comments.js'),
    campgrounds = require('./views/routes/campgrounds.js');

   
mongoose.set('useFindAndModify', false);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

/* ----------------------------- passport setup ----------------------------- */
app.use(require('express-session')({
    secret : "can be anything",
    resave : false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new passportLocal(User.authenticate()));

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    res.locals.problem = req.flash('problem');
    next();
});

app.use( index);
app.use("/campgrounds" ,campgrounds);
app.use("/campgrounds/:id/comments", comments);



app.listen(3000, function(){
    console.log("server has started on port 3000");
});