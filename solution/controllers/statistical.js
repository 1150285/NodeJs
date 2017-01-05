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

var SequenceID = 1;
/*
 * Function for auto-increment Callbacks ID
 */
function getSequence(seqtype) {
    if (seqtype = "stID")
        return SequenceID++;
}

exports.postStatisticals = function(req, res) {
    console.log("»»» Accepted POST request to calculate statID:  " + req.stat_id + "for DatasetID: " + req.dataset_id + " and UserID: " + req.username );
    if (req.username && req.dataset_id && req.stat_id ) {
        callbackID = getSequence("stID");
        var urlCallback = CALLBACK_ROOT + "/Users/" + req.username + "/Datasets/" + req.dataset_id + "/Stats/"+req.stat_id+"/Results"

        var datasetV = "";
        var result = 0;
        Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
            if (err) return console.error(err);
            console.log(dataset);
            datasetV = dataset[0];
            if(GEOMETRIC_MEAN == req.stat_id){
                result = stat.mean(datasetV.values);
            }
            else if(MEDIAN == req.stat_id){
                result = stat.median(datasetV.values);
            }
            else if(MODE == req.stat_id){
                result = stat.mode(datasetV.values);
            }
            else if(MID_RANGE == req.stat_id){
                result = stat.average(datasetV.values);
            }
            else if(VARIANCE == req.stat_id){
                result = stat.variance(datasetV.values);
            }
            else if(STD_DEVIATION == req.stat_id){
                result = stat.standardDeviation(datasetV.values);
            }
            else if(COUNT == req.stat_id){
                result = datasetV.values.length;
            }
            else if(MIN == req.stat_id){
                result = stat.min(datasetV.values);
            }
            else if(MAX == req.stat_id){
                result = stat.max(datasetV.values);
            }

        })
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "<p>Success!... Your request result is "+result+"</p>" +
            "<p>Or come back to Home Page to request more operations <a href='http://localhost:3001/index.html'>Home Page</a></p>" +
            "</h1></body></html>");
    } else {
        if (req.username === undefined || req.dataset_id === undefined || req.stat_id === undefined) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Bad request. Check the definition documentation. " +
                "</h1></body></html>");
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }
};

