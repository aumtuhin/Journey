const express = require('express');
const router = express.Router();
const request = require('request');
//get destination or place model
const Place = require('../models/place');
//get caategory model
const Category = require('../models/category');
//get city model
const City = require('../models/city');

//get destination id and show single destination
router.get('/place/:id', (req, res) => {
    var placeId = req.params.id;
    var city;

    Place.find({ _id: placeId }, (err, place) => {
        if (err) {
            return console.log(err);
        }
        place.map((info) => {
            city = info.city.toString();
        });
        request('http://api.weatherapi.com/v1/current.json?q='+city+'&key=31d8d49409b64d9d93c34809210401', (err, response, body) => {
            if (err) {
                res.render('destination/place', {
                    place: place,
                    weather: null
                });
            } else {
                request('https://api.apify.com/v2/key-value-stores/OHrZyNo9BzT6xKMRD/records/LATEST?disableRedirect=true', (err, response, coronaData) => {
                    if(err) {
                        res.render('destination/place', {
                            place: place,
                            weather: null,
                            coronaStates: null
                        }); 
                    } else {
                        let corona = JSON.parse(coronaData);
                        console.log(corona);
                        res.render('destination/place', {
                            place: place,
                            weather: JSON.parse(body),
                            coronaCountry: corona,
                            coronaStates: corona.infectedByRegion[9],
                            username: 'Johndoe'
                        });
                    }
                });
            }
        });
    });

});

//get top free places in nrw
router.get('/free-places', (req, res) => {
    //get free places
    Place.find({ cost: 0 }).limit(10).sort({ visited: "desc" }).exec((err, places) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('destination/freePlaces', {
                places: places,
                city: 'NRW',
                username: 'Johndoe'
            });
        }
    });
});

// post search free places by city
router.post('/free-places', (req, res) => {
    //get earch city name
    var city = req.body.city;
    city = city.charAt(0).toUpperCase() + city.slice(1);
    city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    Place.find({city: city, cost: 0}).sort({visited: "desc"}).exec((err, places) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('destination/freePlaces', {
                places: places,
                city: city,
                username: 'Johndoe'
            });
        }
    });
});

//place by category
router.get('/category/:name', (req, res) => {
    var name = req.params.name;

    Place.find({category: name}).sort({visited: "desc"}).exec((err, places) => {
        if(err) {
            return console.log(err);
        }
        res.render('destination/categorisedPlaces', {
            city: 'NRW',
            category: name,
            places: places,
            username: 'Johndoe'
        });
    });
});

//search places by categry and city from category
router.post('/category', (req, res) => {
    //get search city name
    var city = req.body.city;
    var category = req.body.category
    city = city.charAt(0).toUpperCase() + city.slice(1);
    city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    Place.find({city: city, category: category}).sort({visited: "desc"}).exec((err, places) => {
        if (err) {
            return console.log(err);
        } else {
            res.render('destination/categorisedPlaces', {
                city: city,
                category: category,
                places: places,
                username: 'Johndoe'
            });
        }
    });
});

//get custom tour plan page
router.get('/custom-tour-plan', (req, res) => {
    Category.find({}, (err, categories) => {
        if(err) {
            console.log(err);
        } else {
            res.render('destination/custom-search', {
                categories: categories,
                username: 'Johndoe'
            });
        }
    });
});

//custom tour plan search page
router.post('/custom-tour-plan', (req, res) => {
    //get from body
    let city = req.body.city;
    let checkIn = req.body.checkIn;
    let checkOut = req.body.checkOut;
    let cost = req.body.cost;
    let categories = req.body.categories;
    let activities = req.body.activities;
    // First we split the values to arrays date1[0] is the year, [1] the month and [2] the day
    checkIn = checkIn.split('-');
    checkOut = checkOut.split('-');

    // Now we convert the array to a Date object, which has several helpful methods
    checkIn = new Date(checkIn[0], checkIn[1], checkIn[2]);
    checkOut = new Date(checkOut[0], checkOut[1], checkOut[2]);
    // We use the getTime() method and get the unixtime (in milliseconds, but we want seconds, therefore we divide it through 1000)
    date1_unixtime = parseInt(checkIn.getTime() / 1000);
    date2_unixtime = parseInt(checkOut.getTime() / 1000);
    // This is the calculated difference in seconds
    var timeDifference = date2_unixtime - date1_unixtime;
    // in Hours
    var timeDifferenceInHours = timeDifference / 60 / 60;
    // and finaly, in days :)
    var days = timeDifferenceInHours  / 24;
    console.log(days);

    if(days==0) {
        days = 1;
    }

    Place.find({city: city, category: {$in: categories}, activity: {$in: activities}}).limit(3*days).sort({visited: "desc"}).exec((err, places) => {
        console.log(places.length);
        if(places.length < 3*days) {
            Place.find({category: {$in: categories}, activity: {$in: activities}}).limit((3*days)).sort({visited: 'desc'}).exec((err, places2) => {
                // let newPlaces = places.concat(places2);
                // const filteredArr = newPlaces.reduce((acc, current) => {
                //     const x = acc.find(item => item.name === current.name);
                //     if (!x) {
                //       return acc.concat([current]);
                //     } else {
                //       return acc;
                //     }
                //   }, []);
                console.log('second query');
                res.render('destination/personalized-result',{
                    city: city,
                    days: days,
                    places: places,
                    places2: places2,
                    username: 'Johndoe'
                    // places3: filteredArr
                });
            });
        } else {
            console.log('first query');
            res.render('destination/personalized-result',{
                city: city,
                days: days,
                places: places,
                places2: null,
                username: 'Johndoe'
            });
        }
    });
});

// search place by city from home page
router.post('/search/city', (req, res) => {
    let city = req.body.city;

    Place.find({city: city}).sort({visited: "desc"}).exec((err, places) => {
        if(err) {
            return console.log(err);
        } else {
            res.render('destination/places', {
                places: places,
                city: city,
                username: 'Johndoe'
            });
        }
    });
});

//get city name via ajax and show suggestions
router.post('/search-city', (req, res, next) => {
    let city = req.body.city;
    city = city.charAt(0).toUpperCase() + city.slice(1);
    city = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    City.find({name: { $regex: city, $options: "i" }}, (err, cities) => {
        if(err) {
            console.log('Error for getting popular city by city name', err);
        } if(city == "") {
            res.status(404).send(cities);
        } else {
            res.status(200).send(cities);
        }
    });
});


module.exports = router;

