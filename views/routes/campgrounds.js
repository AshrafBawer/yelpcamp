var express = require("express"),
    Campground = require('../../models/campground'),

    middleware = require('../../middleware');

var  date = require('date-and-time');
var dateNow = date.format(new Date(), 'YYYY/MM/DD')    

var router = express.Router({mergeParams:true});   


/* -------------------------------------------------------------------------- */
/*                              campgrounds route                             */
/* -------------------------------------------------------------------------- */

/* -------------------------- all campgrounds route -------------------------- */

router.get('/', function(req,res){
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/campgrounds' , {campgrounds:allCampgrounds});
        }
    });

});

/* ------------------------------ create route ------------------------------ */
router.get('/new',middleware.isLoggedIn, function(req,res){
    res.render('campgrounds/new');
});

router.post('/', middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var date = dateNow;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create({
        name: name,
        image: image,
        description: desc,
        price:price,
        date:date,
        author:author
    }, function(err,campground){
        if(err){
            res.redirect('back');
        }else {
            req.flash('success', 'New campground successfuly created!');
            console.log(campground.date);
            res.redirect('/campgrounds');
        }
    });
});

/* ------------------------------- show route ------------------------------- */
router.get('/:id',function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            req.flash('problem', 'You entered wrong ID');
            res.redirect('back');
        }else {
            res.render('campgrounds/show', {campground:foundCampground});
        }
    });
});

/* ------------------------------ update route ------------------------------ */

router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req,res)
    { 
        Campground.findById(req.params.id, function(err,foundCampground){
            res.render('campgrounds/edit', {campground:foundCampground});
            });
     });



router.put('/:id',middleware.checkCampgroundOwnership, function(req,res){
    console.log(req.body.campground);
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated){
        if(err){
            res.redirect('/');
            console.log(err);
        }else {
            req.flash('success', 'Campground successfully updated!');
            res.redirect('/campgrounds/'+ req.params.id);
        }
    });
});


/* ------------------------------ Destroy route ----------------------------- */
router.delete('/:id',middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('back');
        } else {
            req.flash('success', 'Campground successfully removed!');
            res.redirect('/campgrounds');
        }
    });
});

/* -------------------------------------------------------------------------- */


module.exports = router;