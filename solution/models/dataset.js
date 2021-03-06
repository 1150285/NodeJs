var mongoose = require('../db/db'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var datasetSchema = new Schema({
    idDataset: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    numRows: {
        type: Number,
        required: true
    },
    numCols: {
        type: Number,
        required: true
    },
    values: [Number]
});

autoIncrement.initialize(mongoose);
datasetSchema.plugin(autoIncrement.plugin, { model: 'Dataset', field: 'idDataset', startAt: 1});

var Dataset = module.exports = mongoose.model('Dataset', datasetSchema);
