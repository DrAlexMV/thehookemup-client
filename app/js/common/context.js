var User = require('model/user');

var Context = (function () {
	var context = {};

	var currentUser =
	context.currentUser = m.prop();

	// If we already have the user object. e.g. after login
	context.setCurrentUser = function(userObject) {
		console.log('Getting from external source');
		currentUser(userObject);
		console.log(currentUser());
	};

	// Lazy Singleton
	context.getCurrentUser = (function(callback) {
		if (currentUser() === undefined) {
			console.log('Getting from /me');
			User.getMe().then(
				function(response) {
					currentUser(response);
					callback(currentUser);
				},
				function(error) {
					// Not sure what to do in this case yet.
					currentUser(null);
					callback(currentUser);
				}
			);
		} else {
			callback(currentUser);
		}
	});

	return context;
})();

module.exports = Context;
