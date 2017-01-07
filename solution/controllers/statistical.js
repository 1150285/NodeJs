var Statistical = require('../models/statistical');
var Dataset = require('../models/dataset');
var stat = require('simple-statistics');

const GEOMETRIC_MEAN = 0;
const MEDIAN = 1;
const MODE = 2;
const MID_RANGE = 3;
const VARIANCE = 4;
const STD_DEVIATION = 5;
const COUNT = 6;
const MIN = 7;
const MAX = 8;

const callbackPort = process.env.PORT || 3005;
const CALLBACK_ROOT = "http://localhost:" + callbackPort;

var errors = {};
errors['404'] = {code: 404, message: "Item not found!"};
errors['409'] = {code: 409, message: "Conflict, item already exists!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

var SequenceID = 1;
/*
 * Function for auto-increment Callbacks ID
 */
function getSequence(seqtype) {
    if (seqtype = "stID")
        return SequenceID++;
}

exports.postStatisticals = function(req, res) {
    console.log("»»» Accepted POST request to calculate statID:  " + req.query.StatID + "for DatasetID: " + req.dataset_id + " and UserID: " + req.username );
    if (req.params.datasetID && req.params.datasetID && req.query.StatID ) {
        callbackID = getSequence("stID");

        var datasetV = "";
        var result = 0;
        Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
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
            else if(COUNT == req.query.StatID){
                result = datasetV.values.length;
            }
            else if(MIN == req.query.StatID){
                result = stat.min(datasetV.values);
            }
            else if(MAX == req.query.StatID){
                result = stat.max(datasetV.values);
            }
			res.setHeader("Content-Type", "application/json");

            var StatResponse = {stat_id:req.query.StatID,result:result};
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


};

exports.getStatistical = function(req, res) {


};

exports.putStatistical = function(req, res) {


};

exports.deleteStatistical = function(req, res) {


};