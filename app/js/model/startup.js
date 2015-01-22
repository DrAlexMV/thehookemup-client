var API = require('common/api');

var Startup = function(API) {
	var startup = {};

	startup.StartupModel = function(data) {
		this._id = m.prop(data._id);
		this.date = m.prop(data.date);
		this.name = m.prop(data.name);
		this.description = m.prop(data.description);
		this.picture = m.prop(data.picture);
		this.isOwner = m.prop(data.isOwner);
		this.owners = data.owners.map(function(ids) {
			return m.prop(ids);
		});
		this.categories = data.categories.map(function(category) {
			return m.prop(category);
		});

		return this;
	};

	startup.create = function(startup) {
		return this.post('/startup', startup.StartupModel);
	};

	startup.getByID = function(startupID) {
		return this.get('/startup/' + startupID, startup.StartupModel);
	};

	startup.putByID = function(startupID, startup) {
		return this.put('/startup/' + startupID, startup);
	};

	_.mixin(startup, API);
	return startup;
};

module.exports = Startup(API);
