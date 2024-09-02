const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    deposit: {
        type: Number,
        default: 0
    },
    withdraw: {
        type: Number,
        default: 49
    },
    investments: {
        type: Number,
        default: 0
    },
    revenue: {
        type: Number,
        default: 0
    },
    team: {
        type: Number,
        default: 0
    },
    reward: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Balance', schema);