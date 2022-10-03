const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const joi = require('joi');
const { campgroundSchema , reviewSchema} = require('./schemas')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground')
const Review = require('./models/review')

const campgrounds = require('./routes/campground');
const reviews = require('./routes/reviews');


// databse connection.....
mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(()=>{
        console.log('database connected');
    })
    .catch(err=>{
        console.log(err);
    })


app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));



app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);


app.get('/', (req,res)=>{
    res.render('home')
})



app.all('*', (req, res, next)=>{
    next(new ExpressError('Page Not Found'))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
    
})
 
app.listen(3000,()=>{
    console.log('serving on port 3000');
})