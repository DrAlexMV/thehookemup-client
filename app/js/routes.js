'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');
var layout = require('navigation/layout');
var Logger = require('common/logger');

m.route(document.getElementById('app'), '/', {
	'/': layout,
	'/login': auth,
	'/profile/:userid': profile,
});

//(function() {
//	var logger = new Logger(auth.stream);
//})();


