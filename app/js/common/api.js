var API = (function () {
	var api = {};

	api.URL = 'localhost:5000';
	api.API_BASE = '/api/v1';

	api.get = function(objLocation, objType) {
		m.request({method: 'GET',
			url: api.URL + api.API_BASE + objLocation,
			type: objType
		});
	};
})();

module.exports = API;
