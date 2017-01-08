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