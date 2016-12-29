var mongoose = require('mongoose');
mongoose.connection = mongoose.createConnection('mongodb://localhost/datasetdb');
module.exports = mongoose;