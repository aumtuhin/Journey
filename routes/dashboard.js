const express = require('express');
const router = express.Router();

//get City model
const City = require('../models/city');
//get Categoty model
const Category = require('../models/category');
//get Place/Destination model
const Place = require('../models/place');

router.get('/', (req, res) => {
    res.render('dashboard/home', {
        title: 'Dashboard'
    });
});

//get add cities form
router.get('/add-city', (req, res) => {
    res.render('dashboard/addCity', {
        title: 'add-city'
    });
});

//post add-city
router.post('/add-city', (req, res) => {

    var cityName = req.body.cityName;
    var state = req.body.state;

    City.findOne({ name: cityName }, (err, city) => {
        if (city) {
            console.log('City already exsist');
            req.flash('danger', 'City already exits');
            res.render('dashboard/addCity', {
                title: 'add-city'
            });
        } else {
            var city = new City({
                name: cityName,
                state: state
            });

            city.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    City.find((err, cities) => {
                        console.log(cities);
                        req.flash('success', 'City successfully added');
                        res.render('dashboard/addCity', {
                            title: 'add-city'
                        });
                    });
                }
            });
        }
    });
});

//get add destinaion form
router.get('/add-destination', (req, res) => {
    City.find((err, cities) => {
        if (err) {
            return console.log(err)
        }
        Category.find((err, categories) => {
            if(err) {
                console.log(err);
            }
            res.render('dashboard/addDestination', {
                title: 'add-sestination',
                cities: cities,
                categories: categories
            });
        });
    });
});

//post add destination
router.post('/add-destination', (req, res) => {
    var placeName = req.body.placeName;
    var city = req.body.city;
    var address = req.body.address;
    var desc = req.body.desc;
    var imgUrl = req.body.imgUrl;
    var category = req.body.category;
    var activity = req.body.activity;
    var visited = req.body.visited;
    var time = req.body.time;
    var cost = req.body.cost;

    Category.findOne({name: placeName}, (err, place) => {
        if(err) {
            console.log(err);
        }
        if(place) {
            req.flash('danger', 'Place already exits');
            res.render('dashboard/add-destination', {
                title: 'add-destination'
            });
        }

        var place = new Place({
            name: placeName,
            city: city,
            address: address,
            description: desc,
            imgUrl: imgUrl,
            activity: activity,
            category: category,
            time: time,
            cost: cost,
            visited: visited
        });
        place.save((err) => {
            if (err) {
                return console.log(err);
            } else {
                req.flash('success', 'Place successfully added');
                res.redirect('/dashboard/add-destination');
            }
        });
    });


});

//get add category
router.get('/add-category', (req, res) => {
    res.render('dashboard/addCategory', {
        title: 'add-category'
    });
});

//post add category
router.post('/add-category', (req, res) => {
    let categoryName = req.body.categoryName;
    Category.findOne({ name: categoryName }, (err, category) => {
        if (category) {
            console.log('Category already exsist');
            req.flash('danger', 'Category already exits');
            res.render('dashboard/addCategory', {
                title: 'add-category'
            });
        } else {
            var category = new Category({
                name: categoryName
            });

            category.save((err) => {
                if (err) {
                    return console.log(err);
                } else {
                    req.flash('success', 'Category successfully added');
                    res.render('dashboard/addCategory', {
                        title: 'add-category'
                    });
                }
            });
        }
    });
});



module.exports = router;