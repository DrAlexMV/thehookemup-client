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

	edges.isConnection = function(myID, othersID, othersEdgeData) {
		if (myID == othersID) return true;
		return othersEdgeData.connections().some(function(user) {
			return user._id() === myID;
		});
	};

	_.mixin(edges, API);
	return edges;
};

module.exports = Edges(API);
