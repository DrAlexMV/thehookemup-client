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
	context.getCurrentUser = function() {
		var deferred = m.deferred();
		if (currentUser() === undefined) {
			console.log('Getting from /me');
			User.getMe().then(
				function(response) {
					currentUser(response);
					deferred.resolve(currentUser);
				},
				function(error) {
					currentUser(null);
					deferred.reject(error);
				}
			);
		} else {
			deferred.resolve(currentUser);
		}
		return deferred.promise;
	};

	return context;
})();

module.exports = Context;
