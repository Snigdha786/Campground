const express=require('express');
const router = express.Router();

const Joi = require('joi');
const { campgroundSchema} = require('../schemas.js');

const wrapAsync = require('../utility/wrapAsync.js');
const ExpressError = require('../utility/expressError.js');

const Campground=require('../module/campgrounds.js');
const {IsloggedIn, isAuthor}=require('../auth.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
  }

router.get('/', wrapAsync(async (req,res)=>{
    const campgrounds=await Campground.find({})
      res.render('campgrounds/home', {campgrounds})
    })) 
  
  router.get('/new', IsloggedIn, (req,res)=>{
   res.render('campgrounds/new')
    })
  
 router.post('/', IsloggedIn,validateCampground, wrapAsync(async (req, res, next) => {
      // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
const camp=new Campground(req.body);
camp.author = req.user._id;
      await camp.save();
      req.flash('success', 'campground created sucessfully');
      res.redirect(`/campgrounds/${camp._id}`)
  }))
  
  
  router.get('/:id', wrapAsync(async (req,res)=>{
    const {id} =req.params;
    const camp=await Campground.findById(id).populate({
      path: 'reviews',
      populate: {
          path: 'author'
      }
  }).populate('author');
    console.log(camp)
    if(!camp){
      req.flash('error', 'No campground found!!!');
      return res.redirect('/campgrounds')
    }
      res.render('campgrounds/show', {camp})
    }))
  
    router.get('/:id/edit', IsloggedIn, isAuthor, wrapAsync(async (req,res,next)=>{
      const {id} =req.params;
      const camp=await Campground.findById(id)
        res.render('campgrounds/edit', {camp})
      }))
    
      router.put('/:id',IsloggedIn,isAuthor, validateCampground, wrapAsync(async (req,res)=>{
        const {id} =req.params;
        const camp=await Campground.findByIdAndUpdate(id,req.body)
       req.flash('success', 'campground Edited sucessfully');
        res.redirect(`/campgrounds/${camp._id}`)
        }))
  
        router.delete('/:id',IsloggedIn,isAuthor, wrapAsync(async (req,res) => {
          const { id } = req.params;
          await Campground.findByIdAndDelete(id);
          req.flash('success', 'campground deleted sucessfully');
    res.redirect('/campgrounds')
          }))
  module.exports=router;