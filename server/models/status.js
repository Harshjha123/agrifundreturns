const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: String,
    withdrawals: {
        type: Number,
        default: 0
    },
    deposits: {
        type: Number,
        default: 0
    },
    investments: {
        active: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },
    revenue: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('status', schema);