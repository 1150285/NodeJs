var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(
    function(username, password, callback) {
		
        User.findOne({ username: username }, function (err, user) {
            if (err) { 
				console.log("err to find " + username);
				return callback(err); 
			}

            // No user found with that username
            if (!user) { 
				console.log("404 user not found " + username);
				return callback(null, false); 
			}

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { 
					console.log("401 password denied for user " + username);
					return callback(null, false); 
				}

                // Success
                return callback(null, user);
            });
        });
    }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });