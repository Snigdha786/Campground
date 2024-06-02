const express=require('express');
const router = express.Router();
const passport=require('passport');
const User=require('../module/user.js');


router.get('/register', (req,res)=>{
    res.render('user/register')
})

router.post('/register', async (req,res)=>{
    try{
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch(e){
        req.flash('error', 'User already exists');
        res.redirect('/register');
    }   

    })

    router.get('/login', (req,res)=>{
        res.render('user/login')
    })

  
    router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        req.flash('success', 'Welcome Back to Yelp Camp!');
      res.redirect('/campgrounds');
    });

    router.get('/logout', function(req, res, next){
        req.logout(function(err) {
          if (err) { return next(err); }
          req.flash('success', 'Good Bye!');
          res.redirect('/campgrounds');
        });
      });

module.exports=router;