var mongoose = require('../db/db'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var statisticalSchema = new mongoose.Schema({
    idStatistical: {
        type: Number,
        unique: true,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    }
});

var Statistical = module.exports = mongoose.model('Statistical', statisticalSchema);