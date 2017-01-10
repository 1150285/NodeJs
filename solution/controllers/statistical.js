var Dataset = require('../models/dataset');
var stat = require('simple-statistics');
var Function = require('../controllers/functions');

const GEOMETRIC_MEAN = 1;
const MEDIAN = 2;
const MODE = 3;
const MID_RANGE = 4;
const VARIANCE = 5;
const STD_DEVIATION = 6;

var errors = {};
errors['404'] = {code: 404, message: "Item not found!"};
errors['409'] = {code: 409, message: "Conflict, item already exists!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

exports.postStatisticals = function(req, res) {
    console.log("»»» Accepted POST request to calculate statID:  " + req.query.StatID + " for DatasetID: " + Function.getDatasetID() + " and UserID: " + Function.getUserID() );
    if (req.query.StatID ) {
        callbackID = Function.getSequence();

        var datasetV = "";
        var result = 0;
        Dataset.find({ idDataset: Function.getDatasetID() },function (err, dataset) {
            if (err) return console.error(err);
            console.log(dataset);
            datasetV = dataset[0];
            if(GEOMETRIC_MEAN == req.query.StatID){
                result = stat.mean(datasetV.values);
            }
            else if(MEDIAN == req.query.StatID){
                result = stat.median(datasetV.values);
            }
            else if(MODE == req.query.StatID){
                result = stat.mode(datasetV.values);
            }
            else if(MID_RANGE == req.query.StatID){
                result = stat.average(datasetV.values);
            }
            else if(VARIANCE == req.query.StatID){
                result = stat.variance(datasetV.values);
            }
            else if(STD_DEVIATION == req.query.StatID){
                result = stat.standardDeviation(datasetV.values);
            }
            var StatResponse = {stat_id:req.query.StatID,result:result};
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(StatResponse);
        })
        
    } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
            console.log("»»» Bad request. Check the definition documentation.");
    }
};

exports.getStatisticals = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);
};

exports.putStatisticals = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);

};

exports.deleteStatisticals = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);

};