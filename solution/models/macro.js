var mongoose = require('../db/db'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var item = mongoose.Schema({

    transf_id: {
        type: String,
        required: false
    },
    stat_id: {
        type: String,
        required: false
    },
    value: {
        type: Number,
        required: false
    }
},{ _id : false });

var macroSchema = new mongoose.Schema({
    idMacro: {
        type: Number,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    items: [
        item
    ],
    description: {
        type: String,
        required: false
    }
});

autoIncrement.initialize(mongoose);
macroSchema.plugin(autoIncrement.plugin, { model: 'Macro', field: 'idMacro', startAt: 1});

var Macro = module.exports = mongoose.model('Macro', macroSchema);