'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');
var search = require('search/search');
var layout = require('navigation/layout');
var Logger = require('common/logger');

m.route(document.getElementById('app'), '/', {
	'/': layout,
	'/login': auth,
	'/profile/:userid': profile,
	'/search': search,
	'/search/:query': search
});

//(function() {
//	var logger = new Logger(auth.stream);
//})();


