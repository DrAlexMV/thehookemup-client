var API = require('common/api');
var User = require('model/user');

var Edges = function(API) {
	var edges = {};

	edges.EdgesModel = function(data) {
		var connections = data.connections.map(
			function(connection) { 
				return new User.UserModel(connection);
			}
		);

		this.connections = m.prop(connections);

		this.associations = m.prop(data.associations);
	};

	edges.getByID = function(userID) {
		return this.get('/user/' + userID + '/edges', edges.EdgesModel);
	};

	edges.getMyPendingConnections = function() {
		return this.get('/user/me/edges/pending-connections', User.UserModel);
	};

	edges.getMySuggestedConnections = function() {
		return this.get('/user/me/edges/suggested-connections', User.UserModel);
	};

	edges.connectMe = function(otherUserID) {
		return this.post('/user/me/edges/connections', {user: otherUserID});
	};

	edges.deleteConnection = function(otherUserID) {
		return this.delete('/user/me/edges/connections/' + otherUserID);
	};

	_.mixin(edges, API);
	return edges;
};

module.exports = Edges(API);
