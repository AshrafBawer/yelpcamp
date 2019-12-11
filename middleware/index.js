var Campground = require('../models/campground');
var Comment = require('../models/comment');

var middleware = new Object;


middleware.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                req.falsh('error', 'Campground not found');
                res.redirect('back');
            }else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else {
                    req.flash('error', 'You don\'t have the permission to do that');
                    res.redirect('back');
                }
            }
        });      
    }else {
        res.redirect("back");
    }
}

middleware.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login First...');
    res.redirect("/login");
}

middleware.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err){
                res.redirect('/');
            }else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else {
                    req.flash('error', 'You don\'t have permission to do that');
                    res.redirect('back');
                }
            }
        });      
    }else {
        res.redirect("back");
    }
}

module.exports = middleware;


/* ------------------------------- middlewares ------------------------------ */
// function isLoggedIn(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err,foundCampground){
//             if(err){
//                 res.redirect('/');
//             }else {
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 }else {
//                     res.redirect('back');
//                 }
//             }
//         });      
//     }else {
//         res.redirect("back");
//     }
// }

// function checkCommentOwnership(req,res,next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err,foundComment){
//             if(err){
//                 res.redirect('/');
//             }else {
//                 if(foundComment.author.id.equals(req.user._id)){
//                     next();
//                 }else {
//                     res.redirect('back');
//                 }
//             }
//         });      
//     }else {
//         res.redirect("back");
//     }
// }