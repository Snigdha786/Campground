const express=require('express');
const app=express();
const cities= require('./cities.js')
const {descriptors, places}= require('./seedhelper.js')
const Campground=require('../module/campgrounds.js')
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');
  console.log("Database Connected")
}

const sample= arr => arr[Math.floor(Math.random()*arr.length)]
const dBcamp= async ()=> {
await Campground.deleteMany({})
for (let i=0;i<=50;i++){
 const random1000=Math.floor(Math.random()*1000)
 const price=Math.floor(Math.random()*20)+10
const camp= new Campground ({
  author:'65d6c439ac06ba4d6d6c21b1',
    location: `${cities[random1000].city}, ${cities[random1000].state}`,
 title: `${sample(descriptors)} ${sample(places)}`,
 image: 'https://source.unsplash.com/collection/4651015',
description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex veritatis laudantium sapiente eligendi ad officia cum voluptates. Soluta cumque expedita assumenda similique, aspernatur, sapiente iusto necessitatibus odio sed ipsum excepturi',
price
})
await camp.save();
}
  }
dBcamp()
