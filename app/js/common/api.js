var API = (function () {
	var api = {};

	api.URL = 'http://127.0.0.1:5000';
	api.API_BASE = '/api/v1';

	var calcAddress = function (resourceLocation) { return api.URL + api.API_BASE + resourceLocation; };

	api.get = function(objLocation, objType) {
		return m.request({
			method: 'GET',
			url: api.URL + api.API_BASE + objLocation,
			type: objType
		});
	};

	api.post = function (resourceLocation, data, resourceType) {
		return m.request({
			method: 'POST',
			url: calcAddress(resourceLocation),
			type: resourceType,
			data: data
		});
	};

	return api;
})();

module.exports = API;
