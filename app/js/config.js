var config = {};

var calculateAPIURL = function(currentLocation, port) {
	var arr = currentLocation.split("/");
	return arr[0] + '//' + arr[2].split(':')[0] + ':' + port;
};

config['API_PORT'] = 5000;
config['API_URL'] = calculateAPIURL(window.location.href, config['API_PORT']);
config['API_BASE'] = '/api/v1';
config['FACEBOOK_APP_ID'] = '744792018972866';
config['LINKEDIN_APP_ID'] = '787w2nq70p2uaj';
config['LINKEDIN_STATE'] = 'FdGa28s3fSv';

module.exports = config;
