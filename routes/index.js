const express = require('express');
const router = express.Router();

//get city model
const City = require('../models/city');
const place = require('../models/place');
//get place model
const Place = require('../models/place');

router.get('/', async (req, res, next) => {
    var cityNames = [];
    //find most popular cities by visiting
    City.find({}).limit(7).sort({visited: "desc"}).exec((err, popularCities) => {
        if(err) {
            console.log(err);
        }
        popularCities.map((city) => {
            cityNames.push(city.name);
        });
        
        Place.find({city: cityNames[0]}).sort({visited: "desc"}).limit(8).exec((err, city1Places) => {
            Place.find({city: cityNames[1]}).sort({visited: "desc"}).limit(8).exec((err, city2Places) => {
                Place.find({city: cityNames[2]}).sort({visited: "desc"}).limit(8).exec((err, city3Places) => {
                    Place.find({city: cityNames[3]}).sort({visited: "desc"}).limit(8).exec((err, city4Places) => {
                        Place.find({city: cityNames[4]}).sort({visited: "desc"}).limit(8).exec((err, city5Places) => {
                            Place.find({city: cityNames[5]}).sort({visited: "desc"}).limit(8).exec((err, city6Places) => {
                                Place.find({city: cityNames[6]}).sort({visited: "desc"}).limit(8).exec((err, city7Places) => {
                                    Place.find().sort({visited: "desc"}).limit(3).exec((err, popularPlaces) => {
                                        res.render('index', {
                                            title: 'An Intelligent Travel System',
                                            popularCities: popularCities,
                                            popularPlaces: popularPlaces,
                                            city1Places: city1Places,
                                            city2Places: city2Places,
                                            city3Places: city3Places,
                                            city4Places: city4Places,
                                            city5Places: city5Places,
                                            city6Places: city6Places,
                                            city7Places: city7Places,
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});


module.exports = router;