const Campground=require('./module/campgrounds.js');

module.exports.IsloggedIn = (req, res, next) => {
if(!req.isAuthenticated()){
    req.flash('error', 'Login first');
    res.redirect('/login')
  } else{
    next()
  }}

  module.exports.isAuthor=async(req,res,next)=>{
    const {id} =req.params;
      const camp=await Campground.findById(id)
    if (!camp.author.equals(req.user._id)){
      req.flash('error', 'You are not Allowed!!!');
      res.redirect('/campgrounds')
    }else{
      next()
    }

  }