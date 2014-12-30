var API = (function () {
	var api = {};

	api.URL = 'http://127.0.0.1:5000';
	api.API_BASE = '/api/v1';

	api.xhrConfig = function(xhr) {
		xhr.withCredentials = true;
	};

	api.get = function(objLocation, objType) {
		m.request({method: 'GET',
			url: api.URL + api.API_BASE + objLocation,
			type: objType,
			config: api.xhrConfig
		});
	};

	return api;
})();

module.exports = API;
