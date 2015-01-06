var User = require('model/user');
var StreamCommon = require('common/stream-common');

var Context = (function () {
	var context = {};

	context.stream = new Bacon.Bus();

	var currentUser =
	context.currentUser = m.prop();

	// If we already have the user object. e.g. after login
	context.setCurrentUser = function (userObject) {
		currentUser(userObject);
		context.stream.push(new StreamCommon.Message('Context::Login', { user: currentUser() }));
	};

	// Lazy Singleton
	context.getCurrentUser = function() {
		var deferred = m.deferred();

		if (!currentUser()) {
			User.getMe().then(
				function(response) {
					context.setCurrentUser(response);
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
