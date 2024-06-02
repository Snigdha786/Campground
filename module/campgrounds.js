
const mongoose = require('mongoose');
const Review=require('./review.js');
const Schema=mongoose.Schema;

const Campgroundschema= new Schema({
title: String,
price:Number,
image: String,
description: String,
location:String, 
description: String,
author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
reviews:  [{
      type: Schema.Types.ObjectId,
      ref: "Review"
    }]
})
Campgroundschema.post('findOneAndDelete', async function (doc) {
  if (doc) {
      await Review.deleteMany({
          _id: {
              $in: doc.reviews
          }
      })
  }
})
const Campground=mongoose.model('Campground',Campgroundschema )

module.exports=Campground;
