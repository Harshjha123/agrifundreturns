const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    users: {
        type: Number,
        default: 0
    },
    deposits: {
        inCrypto: {
            type: Number,
            default: 0
        },
        taxCrypto: {
            type: Number,
            default: 0
        },
        inInr: {
            type: Number,
            default: 0
        },
        taxInr: {
            type: Number,
            default: 0
        }
    },
    withdrawals: {
        inCrypto: {
            type: Number,
            default: 0
        },
        taxCrypto: {
            type: Number,
            default: 0
        },
        inInr: {
            type: Number,
            default: 0
        },
        taxInr: {
            type: Number,
            default: 0
        }
    },
    investments: {
        type: Number,
        default: 0
    },
    return: {
        type: Number,
        default: 0
    },
    daily: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('site-status', schema);