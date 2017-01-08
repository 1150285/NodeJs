var Macro = require('../models/macro');
var macros =  {};

//A group of functions to Calculate Stats or Transfs and Prints Charts in a row 

var errors = {};
errors['404'] = {code: 404, message: "Macro not found!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

exports.getMacros = function(req, res) {

    Macro.find({},{_id: 0, __v: 0},function (err, macros) {
        if (err) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[statusCode]);
            console.log("»»» None datasets found! ");
            return console.error(err);
        }
        else {
            if (macros.length === 0) {

                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[statusCode]);
                console.log("»»» None datasets found! ");
            }
            else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(macros);
                console.log("»»» Returned GET with an existent Dataset");
            }
        }
    });

};

exports.postMacros = function(req, res) {
    if (req.params.userID && req.body.items) {
        var count=0;
        var n = req.body.items.length;
        for(var i=0; i<n; i++){
            var oper = req.body.items[i];
            if(oper.stat_id != undefined){
                count++
            }
            else if(oper.transf_id != undefined && oper.value != undefined){
                count++
            }
        }
        if(count == n){
            console.log("»»» Accepted POST to this resource. Develop here what happens");

            var macro = new Macro({
                items: req.body.items
            });

            macro.save(function(err, macro) {
                    if (err) {
                        res.statusCode = 400;
                        res.setHeader("Content-Type", "application/json");
                        res.json(errors[statusCode]);
                        console.log("»»» Bad request. Check the definition documentation.");
                        return console.error(err);
                    }
                    else {
                        var macro_id = macro.idMacro;
                        // send 201 response
                        res.statusCode = 201;
                        res.setHeader("Content-Type", "application/json");
                        res.json(macro_id);
                        console.log("»»» Your specific Macro: " + macro_id + " was successfully created for username: " + Function.getUserID());
                    }
                }
            );
        }else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }
    else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end("<html><body><h1> " +
            "Bad request. Check the definition documentation. " +
            "</h1></body></html>");
        console.log("»»» Bad request. Check the definition documentation.");
    }
};

exports.putMacros = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);
};

exports.deleteMacros = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);
};

///////

exports.getMacro = function(req, res) {

    Macro.find({ idMacro: req.idMacro },{_id:0, __v:0},function (err, macros) {
        if (err) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[statusCode]);
            console.log("»»» None datasets found! ");
            return console.error(err);
        }
        else {
            if (macros.length === 0) {

                res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[statusCode]);
                console.log(macros);
                console.log("»»» None datasets found! ");
            }
            else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(macros);
                console.log("»»» Returned GET with an existent Dataset");
            }
        }
    });

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
        res.setHeader("Content-Type", "application/json");
        res.end("<html><body><h1> " +
            "<p>Success!... Your request operation number is " + callbackID + "</p>" +
            "<p>This is a heavy operation so gets your callback result within 30 seconds in <a href='" + "http://localhost:3001/Results/" + "'" + ">Results</a></p>" +
            "<p>Or come back to Home Page to request more operations <a href='http://localhost:3001/index.html'>Home Page</a></p>" +
            "</h1></body></html>");
    } else {
        if (req.username === undefined || req.dataset_id === undefined || req.macro_id === undefined) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.end("<html><body><h1> " +
                "Bad request. Check the definition documentation. " +
                "</h1></body></html>");
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }

};

exports.putMacro = function(req, res) {
    if (Function.getUserID() && req.macro_id) {
        if (req.body.stat_id || req.body.transf_id || req.body.chart_id) {

            //TODO = Develop here what happens
            console.log("»»» Accepted PUT to this resource. Develop here what happens");

            // send 200 response
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json( { OK : "OK"} );
            console.log("»»» Macro: " + req.macro_id + " successfully updated!");
        }
    }
    else {
        if (Function.getUserID() === undefined || req.macro_id === undefined ) {
            res.statusCode = 404 ;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
            console.log("»»» Macro: or User " + req.macro_id + " or " + Function.getUserID() + " not found! ");
        } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }

};

exports.deleteMacro = function(req, res) {
    if (Function.getUserID() === undefined || req.macro_id === undefined ) {

        console.log("»»» Accepted DELETE to this resource. Develop here what happens");

        res.statusCode = 404 ;
        res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
        console.log("»»» Macro or User " + req.macro_id + " or " + Function.getUserID() + " not found! ");
    }
    else {
        if (Function.getUserID() && req.macro_id) {

            delete macros[req.macro_id];

            console.log("»»» Accepted DELETE to this resource. Develop here what happens");

            res.statusCode = 204 ;
            res.setHeader("Content-Type", "application/json");
            res.json( {} );
            console.log("»»» Macro: " + req.macro_id + " successfully deleted for username: " + Function.getUserID());
        } else {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
            console.log("»»» Bad request. Check the definition documentation.");
        }
    }
};