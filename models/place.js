const mongoose = require('mongoose');


const placeSchema = mongoose.Schema({
    name: {
        type: String, required: true
    },
    city:{
        type: String
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imgUrl: {
        type: String
    },
    activity: {
        type: Array
    },
    category: {
        type: Array
    },
    cost: {
    },
    time: {
        type: String
    },
    visited: {
        type: Number
    }

});

const Place = module.exports = mongoose.model('place', placeSchema);