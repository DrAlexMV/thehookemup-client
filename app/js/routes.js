'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');

m.route(document.getElementById('app'), '/', {
	'/': auth,
	'/profile': profile,
});
