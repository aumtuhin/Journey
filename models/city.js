const mongoose = require('mongoose');


const citySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    visited: {
        type: Number
    }
});

const City = module.exports = mongoose.model('city', citySchema);