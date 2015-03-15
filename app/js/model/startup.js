var API = require('common/api');
var ImageModel = require('model/image');
var HandleModel = require('model/handle').HandleModel;

var Startup = function(API) {
	var startup = {};

	startup.StartupModel = function(data) {

		var model = {};

		model._id = m.prop(data._id);
		model.date = m.prop(data.date);
		model.website = m.prop(data.website);
		model.name = m.prop(data.name);
		model.description = m.prop(data.description);
		model.picture = m.prop(data.picture);
		model.isOwner = m.prop(data.isOwner);
		model.owners = m.prop(data.owners);
		model.markets = m.prop(data.markets);
		model.handles = m.prop(data.handles);

		model.getName = function () {
			return model.name();
		};

		model.getPicture = function () {
			return ImageModel.getSource(model.picture());
		};
		
		model.getPath = function () {
			return '/startups'
		};

		return model;
	};

	startup.create = function (startupToCreate) {
		return this.post('/startups', startupToCreate, startup.StartupModel);
	};

	startup.getByID = function(startupID) {
		return this.get('/startups/' + startupID, startup.StartupModel).then(function (response) {
			response.handles(_.map(response.handles(), function(handle) {
				return HandleModel(handle);
			}));
			return response;
		})
	};

	startup.putByID = function(startupID, startup) {
		return this.put('/startups/' + startupID, startup);
	};

	startup.getTrending = function () {
		return this.get('/search/startups?rank=trending&results_per_page=10&page=0').then(function (response) {
			return response.results.map(startup.StartupModel);
		});
	};

	_.mixin(startup, API);
	return startup;
};

module.exports = Startup(API);
