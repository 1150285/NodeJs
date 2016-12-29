var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    if (req.body.username && req.body.password) {

        //TODO = Develop here what happens
        console.log("»»» Accepted POST to this resource. Develop here what happens");

        var user = new User({
            fullName: req.body.fullName,
            username: req.body.username,
            password: req.body.password
        });

        user.save(function(err) {
            if (err)
                return res.send(err);

            // send 201 response
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "The username: " + req.body.username + " was successfully created! " +
                "</h1></body></html>");
            console.log("»»» Username: " + req.body.username + " was successfully created!");
        });


    }else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "Bad request. Check the definition documentation. " +
            "</h1></body></html>");
        console.log("»»» Bad request. Check the definition documentation.");
    }
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {

    //TODO = Develop here what happens
    console.log("»»» Accepted GET to this resource. Develop here what happens");
    User.find(function(err, users) {
        if (err)
            return res.send(err);

        res.json(users);
    });
};


exports.getUser = function(req, res) {
    if (req.username) {
        console.log("»»» Accepted GET to this resource. Develop here what happens");
        res.json(users[req.username])
    } else {
        res.statusCode = 404 ;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "User " + req.username + " not found! " +
            "</h1></body></html>");
        console.log("»»» User " + req.username + " not found!");
    }

};

exports.putUser = function(req, res) {
    if (req.username && req.body.fullName && req.body.password ||
        req.username && req.body.password ||
        req.username && req.body.fullName) {

        //TODO = Develop here what happens
        console.log("»»» Accepted PUT to this resource. Develop here what happens");


        // send 200 response
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "User " + req.username + " successfully updated! " +
            "</h1></body></html>");
        console.log("»»» User " + req.username + " successfully updated!");
    }
    else {
        if (req.username === undefined) {
            res.statusCode = 404 ;
            res.setHeader("Content-Type", "application/html");
            res.end("<html><body><h1> " +
                "User " + req.username + " not found! " +
                "</h1></body></html>");
            console.log("»»» User " + req.username + " not found!");
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


exports.deleteUser = function(req, res) {
    var entry = users[req.username];
    if (entry === undefined) {
        res.statusCode = 404 ;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "User " + req.username + " not found! " +
            "</h1></body></html>");
        console.log("»»» User " + req.username + " not found!");
    }
    else {
        delete users[req.username];
        res.statusCode = 204 ;
        res.setHeader("Content-Type", "application/html");
        res.end("<html><body><h1> " +
            "User " + req.username + " successfully deleted! " +
            "</h1></body></html>");
        console.log("»»» User " + req.username + " successfully deleted!");
    }
};