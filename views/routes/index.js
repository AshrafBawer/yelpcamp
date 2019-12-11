
var User = require("../../models/user"),
passport = require('passport'),
express = require('express'),
router = express.Router();


/* -------------------------------------------------------------------------- */
/*                                  root route                                 */
/* -------------------------------------------------------------------------- */

router.get('/', function(req,res){
    res.render('index');
});


/* -------------------------------------------------------------------------- */
/*                               Auth routes                                  */
/* -------------------------------------------------------------------------- */

/* ----------------------------- register route ----------------------------- */
router.get('/register', function(req,res){
    res.render('register');
});

router.post('/register', function(req,res){
    User.register(new User({username: req.body.username}), req.body.password , function(err,user){
        if(err){
            req.flash('problem', err.message);
            return res.render('../register'); 
        }
        passport.authenticate('local')(req,res,function(){
            req.flash('success',  user.username + 'successfully registered');
            res.redirect("/campgrounds");
        });    

    });
});

/* ------------------------------ Login reouts ------------------------------ */
router.get("/login", function(req,res){
    res.render('login');
});

router.post("/login",passport.authenticate('local', {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) , function(req,res){
    
});

/* ------------------------------ logout route ------------------------------ */
router.get("/logout", function(req,res){
    req.logout();
    req.flash('success', 'successfully logged out');
    res.redirect('/');  
});

/* -------------------------------------------------------------------------- */

module.exports = router;