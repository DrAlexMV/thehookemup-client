'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');
var search = require('search/search');
var SimplePageLayoutMixin = require('navigation/simple-page-layout-mixin');
var Logger = require('common/logger');
var Context = require('common/context');

var layout = new SimplePageLayoutMixin();

m.route(document.getElementById('app'), '/', {
	'/': layout({ controller: function () {}, view: function () {} }),
	'/login': auth,
	'/profile/:userid': layout(profile),
	'/search': layout(search)
});
