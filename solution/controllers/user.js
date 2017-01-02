var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
    if (req.body.username && req.body.password) {

        //TODO = Develop here what happens
        console.log("»»» Accepted POST to this resource");

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

    console.log("»»» Accepted GET to User resource.");
    var users = "";
    User.find(function(err, users) {
		if (err) {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"User: " + req.username + " was not found! " +
					"</h1></body></html>");
			console.log("»»» User " + req.username + " was not found! ");
			return console.error(err);
		}
		else {
			if (users.length === 0) {

				res.statusCode = 404;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"None Users found! " +
						"Create one doing POST to <a href='http://localhost:3001/Users'>http://localhost:3001/Users</a>" +
						"</h1></body></html>");
				console.log(user);
				console.log("»»» User: " + req.username + " was not found! ");
			}	else {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(users);
				console.log("»»» Returned GET with all existent Users");
			}
		}
    });
};

exports.putUsers = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/html");
    res.end("<html><body><h1> " +
        "Method not allowed in this resource. Check the definition documentation " +
        "</h1></body></html>");
}

exports.getUser = function(req, res) {
    console.log("»»» Accepted GET to User resource.");
    var user = "";
    User.find(function(err, user) {
		if (err) {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"User: " + req.username + " was not found! " +
					"</h1></body></html>");
			console.log("»»» User " + req.username + " was not found! ");
			return console.error(err);
		}
		else {
			if (user.length === 0) {

				res.statusCode = 404;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"None Users found! " +
						"Create one doing POST to <a href='http://localhost:3001/Users'>http://localhost:3001/Users</a>" +
						"</h1></body></html>");
				console.log(user);
				console.log("»»» User: " + req.username + " was not found! ");
			}	else {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(users);
				console.log("»»» Returned GET with all existent Users");
			}
		}
    });

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