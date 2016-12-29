var mongoose = require('../db/db'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');

var datasetSchema = new Schema({
    idDataset: {
        type: Number,
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
datasetSchema.plugin(autoIncrement.plugin, { model: 'Dataset', field: 'idDataset' });

var Dataset = module.exports = mongoose.model('Dataset', datasetSchema);
