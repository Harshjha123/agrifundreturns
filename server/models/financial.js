const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    type: Boolean,
    amount: Number,
    item: String,
    date: {
        type: Number,
        default: Date.now()
    }
});

module.exports = mongoose.model('Financial', schema);