var API = require('common/api');

var Edges = function(API) {
	var edges = {};

	edges.EdgesModel = function(data) {
		this.connections = m.prop(data.connections);
		this.associations = m.prop(data.associations);
	};

	edges.getByID = function(userID) {
		return this.get('/user/' + userID + '/edges', edges.EdgesModel);
	};

	_.mixin(edges, API);
	return edges;
};

module.exports = Edges(API);
