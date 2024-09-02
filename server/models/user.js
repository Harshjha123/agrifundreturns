const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        required: true,
        type: String
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    telegram: {
        type: Number,
        default: null
    },
    level: {
        type: Array,
        default: []
    },
    password: String,
    lv1: String,
    lv2: String,
    lv3: String,
    status: {
        type: Boolean,
        default: true
    },
    vip: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    date: {
        type: Number,
        default: Date.now
    }
});

module.exports = mongoose.model('User', schema);