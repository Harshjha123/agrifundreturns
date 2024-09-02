const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    verified: {
        type: Number,
        default: 0
    },
    rewards: {
        type: Number,
        default: 0
    },
    users: {
        lv1: {
            type: Number,
            default: 0
        },
        lv2: {
            type: Number,
            default: 0
        },
        lv3: {
            type: Number,
            default: 0
        }
    },
    income: {
        lv1: {
            type: Number,
            default: 0
        },
        lv2: {
            type: Number,
            default: 0
        },
        lv3: {
            type: Number,
            default: 0
        }
    },
    investments: {
        lv1: {
            type: Number,
            default: 0
        },
        lv2: {
            type: Number,
            default: 0
        },
        lv3: {
            type: Number,
            default: 0
        }
    },
    deposits: {
        lv1: {
            type: Number,
            default: 0
        },
        lv2: {
            type: Number,
            default: 0
        },
        lv3: {
            type: Number,
            default: 0
        }
    }
});

module.exports = mongoose.model('referral', schema);