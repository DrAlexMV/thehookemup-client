'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');
var profileWizard = require('profile/wizard/create-profile-wizard');
var dashboard = require('dashboard/dashboard');
var search = require('search/search');
var startups = require('startups/startups');
var startupWizard = require('startups/wizard/create-startup-wizard');
var communications = require('communications/communications');
var SimplePageLayoutMixin = require('navigation/simple-page-layout-mixin');
var Logger = require('common/logger');
var Context = require('common/context');

var layout = new SimplePageLayoutMixin();

m.route(document.getElementById('app'), '/', {
	'/': layout(dashboard),
	'/login': auth,
	'/profile/:userid': layout(profile),
	'/search': layout(search),
	'/startups/:startupid': layout(startups),
	'/startup-wizard': layout(startupWizard),
	'/notifications': layout(communications),
	'/profile-wizard': layout(profileWizard)
});
