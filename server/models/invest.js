const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    cost: Number,
    period: Number,
    date: {
        type: Number,
        default: Date.now()
    },
    expired: {
        type: Boolean,
        default: false
    },
    product_id: String,
    total: Number,
    hex: String,
    daily: Number, // In percentage
    day: {
        type: Number,
        default: 0
    }, // Number of days Run
    lastRun: Number, // Date of last run
    recharges: {
        type: Number,
        default: 0
    },
    payouts: {
        type: Number,
        default: 0
    },
    investments: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Invest', schema);