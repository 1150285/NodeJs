var Transformation = require('../models/transformation');

var errors = {};
errors['404'] = {code: 404, message: "Transformation not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

const port = process.env.PORT || 3001;
const SERVER_ROOT = "http://localhost:" + port;

const serverHeavyOpsPort = process.env.PORT || 3002;
const serverHeavyOps = "http://localhost:" + serverHeavyOpsPort;

const callbackPort = process.env.PORT || 3005;
const CALLBACK_ROOT = "http://localhost:" + callbackPort;

exports.getTransformations = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
		res.json(errors[res.statusCode]);
};

exports.postTransformations = function(req, res) {

    console.log("»»» Accepted POST request to calculate transfID: " + req.query.transfID + " for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
    if (req.username && req.dataset_id && req.query.StatID ) {
        //callbackID = getSequence("stID");
        var urlCallback = CALLBACK_ROOT + "/Users/" + req.username + "/Datasets/" + req.dataset_id + "/Transf/"+req.query.StatID+"/Results"

        var datasetV = "";
        Dataset.find({ idDataset: req.dataset_id },function (err, dataset) {
            if (err) return console.error(err);
            console.log(dataset);
            datasetV = dataset[0];
            //setTimeout(function() {
            request({
                    uri : serverHeavyOps + "/HeavyOps/" + req.username + "/" + req.dataset_id + "/" + req.query.StatID,
                    method: "POST",
                    json : {text:"test of callback post", sender:"Datasheet_srv.js", callbackURL: urlCallback, myRef:callbackID , dataset:datasetV},
                },
                function(err, res, body){

                    if (!err && 202 === res.statusCode) {
                        console.log("»»» Posted a Heavy Operation request and got " + res.statusCode );
                        console.log("»»» Success!... Gets your callback results within 30 seconds in " + urlCallback  );
                        res.statusCode = 202;
                    } else	{
                        console.log("»»» Internal error in HeavyOps server. Please contact system administrator. Status Code = " + res.statusCode);
                    }
                });
            //}, 2000);
        })
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "<p>Success!... Your request operation number is " + callbackID + "</p>" +
            "<p>This is a heavy operation so gets your callback result within 30 seconds in <a href='" + urlCallback + "'" + ">Results</a></p>" +
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

exports.putTransformations = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
        res.json(errors[res.statusCode]);
};

exports.deleteTransformations = function(req, res) {
		res.statusCode = 405;
		res.setHeader("Content-Type", "application/html");
        res.json(errors[res.statusCode]);
};