const express=require('express');
const app=express();
const ejs=require('ejs');
const ejsmate=require('ejs-mate');
const path=require('path');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const Joi = require('joi');
const methodOverride = require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local')


const {campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground=require('./module/campgrounds.js');
const Review=require('./module/review.js');
const wrapAsync = require('./utility/wrapAsync.js');
const ExpressError = require('./utility/expressError.js');

const User = require('./module/user');

const userRoute=require('./routes/user.js');
const campgroundRoute=require('./routes/campgrounds.js');
const reviewRoute=require('./routes/reviews.js');


app.set('view engine', 'ejs');
app.engine('ejs', ejsmate);
app.set('views', path.join(__dirname, './views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
  console.log("Database Connected")
}

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
  } else {
      next();
  }
}

const sessionConfig = {
  secret: 'top secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser=req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/', userRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute)
        
app.all('*', (req,res,next)=>{
  next(new ExpressError("Page not found!!!", 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
res.status(statusCode).render('error', {err});
})

app.listen(3000, ()=>{
    console.log("Listening at port 3000!!")
})