var config = {};

var calculateAPIURL = function(currentLocation, port) {
	var arr = currentLocation.split("/");
	return arr[0] + '//' + arr[2].split(':')[0] + ':' + port;
};

config['API_PORT'] = 5000;
config['API_URL'] = calculateAPIURL(window.location.href, config['API_PORT']);
config['API_BASE'] = '/api/v1';
config['FACEBOOK_APP_ID'] = '744792018972866'

module.exports = config;
