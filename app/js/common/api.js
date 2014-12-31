var API = (function () {
	var api = {};

	api.URL = 'http://127.0.0.1:5000';
	api.API_BASE = '/api/v1';
	
	api[401] = function () {
		m.route('/login');
	};

	var calcAddress = function(resourceLocation) { return api.URL + api.API_BASE + resourceLocation; };

	api.xhrConfig = function() {
		return function (xhr) {
			xhr.withCredentials = true;
		}
	};

	api.extract = function() {
		return function (xhr) {
			api[xhr.status] && api[xhr.status]();

			if (xhr.responseText.length === 0) { return JSON.stringify({ error: 'Empty server response' }); }
			return xhr.responseText;
		};
	};

	api.get = function(resourceLocation, resourceType) {
		return m.request({
			method: 'GET',
			url: calcAddress(resourceLocation),
			type: resourceType,
			config: api.xhrConfig(),
			extract: api.extract()
		});
	};

	api.post = function(resourceLocation, data, resourceType) {
		return m.request({
			method: 'POST',
			url: calcAddress(resourceLocation),
			type: resourceType,
			data: data,
			config: api.xhrConfig(),
			extract: api.extract()
		});
	};

	return api;
})();

module.exports = API;
