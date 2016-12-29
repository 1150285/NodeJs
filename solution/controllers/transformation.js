var Transformation = require('../models/transformation');

exports.postTransformations = function(req, res) {
    console.log("»»» Accepted POST request to calculate transfID: " + req.transf_id + " for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
    if (req.username && req.dataset_id && req.transf_id ) {
        callbackID = getSequence("stID");

        //setTimeout(function() {
        request({
                uri : serverHeavyOps + "/HeavyOps/" + req.username + "/" + req.dataset_id + "/" + req.transf_id,
                method: "POST",
                json : {text:"test of callback post", sender:"Datasheet_srv.js", callbackURL: CALLBACK_ROOT + "/callback/", myRef:callbackID},
            },
            function(err, res, body){

                if (!err && 202 === res.statusCode) {
                    console.log("»»» Posted a Heavy Operation request and got " + res.statusCode );
                    console.log("»»» Success!... Gets your callback results within 30 seconds in http://localhost:3001/Results/" + callbackID  );
                    res.statusCode = 202;
                } else	{
                    console.log("»»» Internal error in HeavyOps server. Please contact system administrator. Status Code = " + res.statusCode);
                }
            });
        //}, 2000);
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "<p>Success!... Your request operation number is " + callbackID + "</p>" +
            "<p>This is a heavy operation so gets your callback result within 30 seconds in <a href='" + "http://localhost:3001/Results/" + "'" + ">Results</a></p>" +
            "<p>Or come back to Home Page to request more operations <a href='http://localhost:3001/index.html'>Home Page</a></p>" +
            "</h1></body></html>");
    } else {
        if (req.username === undefined || req.dataset_id === undefined || req.transf_id === undefined) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Bad request. Check the definition documentation. " +
                "</h1></body></html>");
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }
};

exports.getTransformations = function(req, res) {


};

exports.getTransformation = function(req, res) {


};

exports.putTransformation = function(req, res) {


};


exports.deleteTransformation = function(req, res) {

};