var mongoose = require('../db/db'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
var Transformation = require('../models/transformation');
var Statistical = require('../models/statistical');

var macroSchema = new mongoose.Schema({
    idMacro: {
        type: Number,
        unique: true,
        required: true
    },
    list: [
        {   order: Number,
            transformation: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Transformation',
                required: false
            },
            statistical: {
                type: mongoose.Schema.Types.ObjectId, ref: 'Statistical',
                required: false
            }
        }
    ],
    description: {
        type: String,
        required: false
    }
});

var Macro = module.exports = mongoose.model('Macro', macroSchema);