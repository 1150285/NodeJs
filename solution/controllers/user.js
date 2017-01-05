var User = require('../models/user');

exports.getUsers = function(req, res) {

	console.log("»»» Accepted GET to User resource.");
	var users = "";
	User.find( {}, { _id:0, password:0, __v:0 } , function(err, users) {
		if (err) {
			res.statusCode = 404 ;
			res.setHeader("Content-Type", "application/html");
			res.end("<html><body><h1> " +
					"None user was not found! " +
			"</h1></body></html>");
			console.log("»»» None user was not found! ");
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

exports.putUsers = function(req, res) {
	res.statusCode = 405;
	res.setHeader("Content-Type", "application/html");
	res.end("<html><body><h1> " +
			"Method not allowed in this resource. Check the definition documentation " +
	"</h1></body></html>");
}

exports.deleteUsers = function(req, res) {
	res.statusCode = 405;
	res.setHeader("Content-Type", "application/html");
	res.end("<html><body><h1> " +
			"Method not allowed in this resource. Check the definition documentation " +
	"</h1></body></html>");
}


//##########

exports.getUser = function(req, res) {
	console.log("»»» Accepted GET to User resource.");
	var user = "";
	User.find( { username: req.username }, { _id:0, __v:0 }, function(err, user) {
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
				res.json(user);
				console.log("»»» Returned GET with all existent Users");
			}
		}
	});

};

exports.postUser = function(req, res) {
	res.statusCode = 405;
	res.setHeader("Content-Type", "application/html");
	res.end("<html><body><h1> " +
			"Method not allowed in this resource. Check the definition documentation " +
	"</h1></body></html>");
}

exports.putUser = function(req, res) {
	console.log("»»» Accepted PUT to User resource.");
	if (req.username && req.body.fullName) {

		User.findOne({ username: req.username }, function (err, user) {
			if (err) { return console.error(err); }

			// No user found with that username
			if (!user) { 
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"User: " + req.username + " was not found! " +
				"</h1></body></html>");
				console.log("»»» User " + req.username + " was not found! ");
				return console.error(err);; 
			}
			else {

				if (req.body.fullName) {
					var isFullNameUpdated = User.findOneAndUpdate({ username: req.username}, { $set: { fullName: req.body.fullName }} ,function (err, user) {
						if (!err) { console.log("»»» Update fullName OK. Do a GET do see Results");	}
						else {console.log(err)}
					});
				}

				res.statusCode = 200;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"Updates OK. Do a GET to see the results " +
				"</h1></body></html>");
			}
		});
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

exports.deleteUser = function(req, res) {
	if (req.username) {
		User.findOne({ username: req.username }, function (err, user) {
			if (err) { return console.error(err); }

			// No user found with that username
			if (!user) { 
				res.statusCode = 404 ;
				res.setHeader("Content-Type", "application/html");
				res.end("<html><body><h1> " +
						"User: " + req.username + " was not found! " +
				"</h1></body></html>");
				console.log("»»» User " + req.username + " was not found for delete! ");
				return console.error(err);; 
			}
			else {
				var isDeleted = User.remove({ username: req.username} ,function (err, user) {
					if (!err) { console.log("»»» Delete OK. Do a GET do see Results");	}
					else {console.log(err)}
				});
				if (isDeleted){

					res.statusCode = 200;
					res.setHeader("Content-Type", "application/html");
					res.end("<html><body><h1> " +
							"Delete OK. Do a GET to see the results " +
					"</h1></body></html>");
				}
			}
		});
	}
};