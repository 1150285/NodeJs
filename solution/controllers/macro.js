var Macro = require('../models/macro');

exports.postMacros = function(req, res) {
    if (req.username && req.body.macro_id) {
        if (req.body.stat_id || req.body.transf_id || req.body.chart_id) {

            //TODO = Develop here what happens
            console.log("»»» Accepted POST to this resource. Develop here what happens");

            // send 201 response
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "The Macro: " + req.body.macro_id + " was successfully created for username: " + req.username +
                "</h1></body></html>");
            console.log("»»» Macro: " + req.body.macro_id + " was successfully created for username: " + req.username);
        }
    }
    else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Bad request. Check the definition documentation. " +
            "</h1></body></html>");
        console.log("»»» Bad request. Check the definition documentation.");
    }
};

exports.getMacros = function(req, res) {
    console.log("»»» Accepted GET to this resource. Develop here what happens");
    res.json(macros);

};

exports.getMacro = function(req, res) {
    if (req.macro_id) {
        console.log("»»» Accepted GET to this resource. Develop here what happens");
        res.json(macros[req.macro_id]);
    } else {
        res.statusCode = 404 ;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Macro or User " + req.macro_id + " or " + req.username + " not found! " +
            "</h1></body></html>");
        console.log("»»» Macro or User " + req.macro_id + " or " + req.username + " not found! ");
    }

};

exports.postMacro = function(req, res) {
    console.log("»»» Accepted POST request to calculate transf_id: " + req.macro_id + " for DatasetID: " + req.dataset_id + " and UserID: " + req.username + " Develop here what happens");
    if (req.username && req.dataset_id && req.macro_id ) {
        callbackID = getSequence("stID");

        //setTimeout(function() {
        request({
                uri : serverHeavyOps + "/HeavyOps/" + req.username + "/" + req.dataset_id + "/" + req.macro_id,
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
        if (req.username === undefined || req.dataset_id === undefined || req.macro_id === undefined) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Bad request. Check the definition documentation. " +
                "</h1></body></html>");
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }

};


exports.putMacro = function(req, res) {
    if (req.username && req.macro_id) {
        if (req.body.stat_id || req.body.transf_id || req.body.chart_id) {

            //TODO = Develop here what happens
            console.log("»»» Accepted PUT to this resource. Develop here what happens");

            // send 200 response
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Macro: " + req.macro_id + " successfully updated! " +
                "</h1></body></html>");
            console.log("»»» Macro: " + req.macro_id + " successfully updated!");
        }
    }
    else {
        if (req.username === undefined || req.macro_id === undefined ) {
            res.statusCode = 404 ;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Macro: or User " + req.macro_id + " or " + req.username + " not found! " +
                "</h1></body></html>");
            console.log("»»» Macro: or User " + req.macro_id + " or " + req.username + " not found! ");
        } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Bad request. Check the definition documentation. " +
                "</h1></body></html>");
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }

};


exports.deleteMacro = function(req, res) {
    if (req.username === undefined || req.macro_id === undefined ) {

        console.log("»»» Accepted DELETE to this resource. Develop here what happens");

        res.statusCode = 404 ;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Macro or User " + req.macro_id + " or " + req.username + " not found! " +
            "</h1></body></html>");
        console.log("»»» Macro or User " + req.macro_id + " or " + req.username + " not found! ");
    }
    else {
        if (req.username && req.macro_id) {

            delete macros[req.macro_id];

            console.log("»»» Accepted DELETE to this resource. Develop here what happens");

            res.statusCode = 200 ;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Macro: " + req.macro_id + " successfully deleted for username: " + req.username +
                "</h1></body></html>");
            console.log("»»» Macro: " + req.macro_id + " successfully deleted for username: " + req.username);
        } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "Bad request. Check the definition documentation. " +
                "</h1></body></html>");
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }
};