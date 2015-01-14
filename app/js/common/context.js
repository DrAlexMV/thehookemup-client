var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');

var Context = (function () {
	var context = {};

	context.stream = new Bacon.Bus();

	var currentUser =
	context.currentUser = m.prop();

	var currentUserEdges =
	context.currentUserEdges = m.prop();

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

	context.setCurrentUserEdges = function (updatedEdges) {
		currentUserEdges(updatedEdges);
		context.stream.push(new StreamCommon.Message('Context::Edges', {
			edges: currentUserEdges()
		}));
	};

	context.getCurrentUserEdges = function() {
		var deferred = m.deferred();
		if (!currentUserEdges()) {
			UserEdges.getByID('me').then(
				function(response) {
					Context.setCurrentUserEdges(response);
					deferred.resolve(currentUserEdges)
				},
				function(error){
					currentUserEdges(null);
					deferred.reject(error);
				}
			);
		} else {
			deferred.resolve(currentUserEdges);
		}
		return deferred.promise;
	};

	(function initContext() {
		// Make eager singleton
		context.getCurrentUser();
	})();

	return context;
})();

module.exports = Context;
