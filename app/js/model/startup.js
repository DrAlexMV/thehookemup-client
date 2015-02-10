var API = require('common/api');

var Startup = function(API) {
	var startup = {};

	startup.StartupModel = function(data) {
		this._id = m.prop(data._id);
		this.date = m.prop(data.date);
		this.website = m.prop(data.website);
		this.name = m.prop(data.name);
		this.description = m.prop(data.description);
		this.picture = m.prop(data.picture);
		this.isOwner = m.prop(data.isOwner);
		this.owners = m.prop(data.owners);
		this.markets = m.prop(data.markets);

		this.handles = m.prop(data.handles);
		/*
		[
			{type: 'blog', url: 'www.test.com/blog'},
			{type: 'twitter', url: 'www.twitter.com/thefounderati'},
		]
		*/

		return this;
	};

	startup.create = function (startupToCreate) {
		return this.post('/startups', startupToCreate, startup.StartupModel);
	};

	startup.getByID = function(startupID) {
		return this.get('/startups/' + startupID, startup.StartupModel);
	};

	startup.putByID = function(startupID, startup) {
		return this.put('/startups/' + startupID, startup);
	};

	_.mixin(startup, API);
	return startup;
};

module.exports = Startup(API);
