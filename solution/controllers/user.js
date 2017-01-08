var User = require('../models/user');

var errors = {};
errors['404'] = {code: 404, message: "User not found!"};
errors['409'] = {code: 409, message: "Conflict, user already exists!"};
errors['400'] = {code: 400, message: "Bad Request!"};
errors['405'] = {code: 405, message: "Method not allowed in this resource!"};

exports.getUsers = function(req, res) {

	console.log("»»» Accepted GET to User resource.");
	User.find( {}, { _id:0, password:0, __v:0 } , function(err, users) {
		if (err) {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/json");
			res.json(errors[res.statusCode]);
			console.log("»»» None user was not found! ");
			return console.error(err);
		}
		else {
			if (users.length === 0) {

				res.statusCode = 404;
				res.setHeader("Content-Type", "application/json");
				res.json(errors[res.statusCode]);
				console.log("»»» User was not found! ");
			}	else {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(users);
				console.log("»»» Returned GET with all existent Users");
			}
		}
	});
};

exports.postUsers = function(req, res) {
	if (req.body.username && req.body.password) {

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
			res.setHeader("Content-Type", "application/json");
			res.json(req.body.username);
			console.log("»»» Username: " + req.body.username + " was successfully created!");
		});

	}else {
		res.statusCode = 400;
		res.setHeader("Content-Type", "application/json");
		res.json(errors[res.statusCode]);
		console.log("»»» Bad request. Check the definition documentation.");
	}
};

exports.putUsers = function(req, res) {
	res.statusCode = 405;
	res.setHeader("Content-Type", "application/json");
	res.json(errors[res.statusCode]);
};

exports.deleteUsers = function(req, res) {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);
};


//##########

exports.getUser = function(req, res) {
	console.log("»»» Accepted GET to User resource.");
	User.find( { username: Function.getUserID() }, { _id:0, __v:0 }, function(err, user) {
		if (err) {
			res.statusCode = 404 ;
            res.setHeader("Content-Type", "application/json");
            res.json(errors[res.statusCode]);
			console.log("»»» User " + Function.getUserID() + " was not found! ");
			return console.error(err);
		}
		else {
			if (user.length === 0) {

				res.statusCode = 404;
                res.setHeader("Content-Type", "application/json");
                res.json(errors[res.statusCode]);
				console.log(user);
				console.log("»»» User: " + Function.getUserID() + " was not found! ");
			}	else {
				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json");
				res.json(user);
				console.log("»»» Returned GET with all existent Users");
			}
		}
	});

};

exports.postUser = function(req, res) {
	res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.json(errors[res.statusCode]);
};

exports.putUser = function (req, res) {
    console.log("»»» Accepted PUT to User resource.");
    if (Function.getUserID() && req.body.fullName) {

        User.findOneAndUpdate(
            {username: Function.getUserID()},
            {$set: {fullName: req.body.fullName}},
            {projection: {_id: 0, __v: 0}, new: true},
            function (err, user) {
                if (!err) {
                    console.log("»»» Update fullName OK. Do a GET do see Results");
                    if (user !== null) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(user);
                    } else {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "application/json");
                        res.json(errors[res.statusCode]);
                        console.log("»»» User " + Function.getUserID() + " was not found! ");
                        return console.error(err);
                    }
                }
                else {
                    res.statusCode = 500;
                    res.json(errors[res.statusCode]);
                    console.log(err)
                }
            }
        );
    }
    else {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Content-Type", "application/json");
        res.json(errors[res.statusCode]);
        console.log("»»» Bad request. Check the definition documentation.");
    }
};

exports.deleteUser = function(req, res) {
	if (Function.getUserID()) {
        User.findOne({username: Function.getUserID()},
			function (err, user) {
                if (err) {
                    return console.error(err);
                }

                // No user found with that username
                if (!user) {
                    res.statusCode = 404;
                    res.setHeader("Content-Type", "application/json");
                    res.json(errors[res.statusCode]);
                    console.log("»»» User " + Function.getUserID() + " was not found for delete! ");
                    return console.error(err);
                }
                else {
                    var isDeleted = User.remove({username: Function.getUserID()},
						function (err) {
							if (!err) {
								console.log("»»» Delete OK. Do a GET do see Results");
							}
							else {
								console.log(err)
							}
                    	}
                    );
                    if (isDeleted) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(errors[res.statusCode]);
                    }
                }
            }
        );
	}
};