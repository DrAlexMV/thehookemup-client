var API = require('common/api');
var User = require('model/user');

var Edges = function(API) {
	var edges = {};

	edges.EdgesModel = function(data) {
		this.connections = m.prop(data.connections.map(
			function(connection) {
				return new User.UserModel(connection);
			}
		));

		this.pendingConnections = m.prop(data.pendingConnections.map(
			function(pendingConnection) { 
				return new User.UserModel(pendingConnection);
			}
		));

    this.pendingConnectionsMessages = m.prop(data.pendingConnectionsMessages);


		this.suggestedConnections = m.prop(data.suggestedConnections.map(
			function(suggestedConnection) {
				return new User.UserModel(suggestedConnection);
			}
		));

		this.associations = m.prop(data.associations);

		return this;
	};

	edges.getByID = function(userID) {
		return this.get('/user/' + userID + '/edges', edges.EdgesModel);
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
