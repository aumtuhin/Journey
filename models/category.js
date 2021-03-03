const mongoose = require('mongoose');


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const Category = module.exports = mongoose.model('category', categorySchema);