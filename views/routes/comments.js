var express = require("express"),
    Campground = require('../../models/campground'),
    middleware = require('../../middleware'),
    Comment = require("../../models/comment");

var router = express.Router({mergeParams:true});

/* -------------------------------------------------------------------------- */
/*                               comments route                               */
/* -------------------------------------------------------------------------- */

/* ------------------------------ create route ------------------------------ */
router.get('/new',middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err);
        }else {
            res.render('comments/new', {campground:campground});
        }
    });
});

router.post('/',middleware.isLoggedIn, function(req,res){
    Campground.findById(req.params.id , function(err,campground){
        if(err){
            console.log(err);
        }else {
            Comment.create(req.body.comment , function(err, comment){
                if(err){
                    console.log(err);
                }else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Comment successfully created!');
                    res.redirect("/campgrounds/"+ req.params.id);
                }
            });
        }
    });
});
/* -------------------------------------------------------------------------- */

/* ------------------------------- Edit route ------------------------------- */
router.get('/:comment_id/edit',middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err,comment){
        if(err){
            res.redirect('back');
        }else {
            res.render('./comments/edit.ejs', {campground_id:req.params.id, comment:comment});
        }
    });
  
});

router.put('/:comment_id', function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect('back');
        }else {
            req.flash('success', 'Comment successfully updated!');
            res.redirect('/campgrounds/' + req.params.id );
        }
    });
});


/* ------------------------------ delete route ------------------------------ */
router.delete('/:comment_id',middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(!err){
            req.flash('success', 'Comment successfully deleted!');
            res.redirect('back');
        }
    });

});


/* -------------------------------------------------------------------------- */



module.exports = router;