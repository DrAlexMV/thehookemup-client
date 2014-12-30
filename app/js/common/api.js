var API = (function () {
	var api = {};

	api.URL = 'http://127.0.0.1:5000';
	api.API_BASE = '/api/v1';

	var calcAddress = function(resourceLocation) { return api.URL + api.API_BASE + resourceLocation; };

	api.xhrConfig = function(xhr) {
		xhr.withCredentials = true;
	};

	api.extractErrors = function(xhr) {
		if (xhr.status > 200) {
			return JSON.stringify({
				error : JSON.parse(xhr.responseText).error,
				status: xhr.status
			});
		}
		return xhr.responseText;
	};

	api.get = function(resourceLocation, resourceType) {
		return m.request({
			method: 'GET',
			url: calcAddress(resourceLocation),
			type: resourceType,
			config: api.xhrConfig,
			extract: api.extractErrors
		});
	};

	api.post = function(resourceLocation, data, resourceType) {
		return m.request({
			method: 'POST',
			url: calcAddress(resourceLocation),
			type: resourceType,
			data: data,
			config: api.xhrConfig,
			extract: api.extractErrors
		});
	};

	return api;
})();

module.exports = API;
