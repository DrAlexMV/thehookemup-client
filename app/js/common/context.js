var User = require('model/user');
var StreamCommon = require('common/stream-common');
var UserEdges = require('model/user-edges');

var Context = (function () {
	var context = {};

	context.stream = new Bacon.Bus();

	var currentUser =
	context.currentUser = m.prop();

  var pendingConnections =
  context.pendingConnections = m.prop();

  var edges =
    context.edges = m.prop();

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

  // If we already have the user object. e.g. after login
  context.setPendingConnections = function (pendingConnectionsUserArray) {
    pendingConnections(pendingConnectionsUserArray);
    context.stream.push(new StreamCommon.Message('Context::PendingConnections', { pendingConnections: pendingConnections() }))
  };

  // Lazy Singleton
  context.getPendingConnections = function() {
    var deferred = m.deferred();
    if (!pendingConnections()) {
        UserEdges.getMyPendingConnections().then(
          function(response) {
            Context.setPendingConnections(response);
            deferred.resolve(pendingConnections)
        },
        function(error){
          pendingConnections(null);
          deferred.reject(error);
        }
      );
    } else {
      deferred.resolve(pendingConnections);
    }
    return deferred.promise;
  };




  context.setEdges = function (updatedEdges) {
    edges(updatedEdges);
    context.stream.push(new StreamCommon.Message('Context::Edges', { edges:edges() }))
  };

  // Lazy Singleton
  context.getEdges = function() {
    var deferred = m.deferred();
    if (!edges()) {
      UserEdges.getByID('me').then(
        function(response) {
          Context.setEdges(response);
          deferred.resolve(edges)
        },
        function(error){
          edges(null);
          deferred.reject(error);
        }
      );
    } else {
      deferred.resolve(edges);
    }
    return deferred.promise;
  };


	return context;
})();

module.exports = Context;
