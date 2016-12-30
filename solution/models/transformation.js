var mongoose = require('../db/db'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var transformationSchema = new Schema({
    idTransformation: {
        type: Number,
        unique: true,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

autoIncrement.initialize(mongoose);
transformationSchema.plugin(autoIncrement.plugin, { model: 'Transformation', field: 'idTransformation', startAt: 1});

var Transformation = module.exports = mongoose.model('Transformation', transformationSchema);