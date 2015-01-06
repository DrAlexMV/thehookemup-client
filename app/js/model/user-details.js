var API = require('common/api');

var Details = function(API) {
	var details = {};

	details.DetailModel = function(data) {
		this.title = m.prop(data.title);
		this.content = data.content.map(function(item) {
			var subpoints = [];
			if (item.subpoints) {
				subpoints = item.subpoints.map(function(point) {
					return { title: m.prop(point.title), description: m.prop(point.description) };
				});
			}
			return {
				subpoints: subpoints,
				description: m.prop(item.description),
				title: m.prop(item.title)
			};
		});
	};

	details.getByID = function(userID) {
		return this.get('/user/' + userID + '/details', details.DetailModel);
	};

	details.putByID = function(userID, details) {
		return this.put('/user/' + userID + '/details', details);
	};

	details.patchByID = function(userID, details) {
		return this.patch('/user/' + userID + '/details', details);
	};

	_.mixin(details, API);
	return details;
};

module.exports = Details(API);
