const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    user: String,
    phone: String,
    name: String,
    level: Number,
    date: {
        type: Number,
        default: Date.now()
    },
    commission: {
        type: Number,
        default: 0
    },
    investments: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('ReferralRec', schema);