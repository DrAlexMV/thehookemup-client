'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');
var Logger = require('common/logger');

m.route(document.getElementById('app'), '/', {
	'/login': auth,
	'/profile/:userid': profile,
});

(function() {
	var logger = new Logger(auth.stream);
})();


