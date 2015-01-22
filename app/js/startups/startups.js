var MessageFeed = require('startups/message-feed');
var StartupProfileHeader = require('startups/startup-profile-header');
var StartupOverview = require('startups/startup-overview');

var startups = {};

var vm =
startups.vm = {
	init: function () {
		vm.header = StartupProfileHeader();
		vm.messageFeed = MessageFeed();
		vm.overview = StartupOverview();
	}
};

startups.controller = function () {
	vm.init();
};

startups.view = function () {
	return [
		m('div.ui.grid', [
			m('div.ui.centered.row', [
				m('div.fourteen.wide.column', [
					vm.header.view(),
					m('div.ui.hidden.divider'),
					m('div.ui.stackable.grid', [
						m('div.row', [
							m('div.eleven.wide.column', [
								vm.overview.view()
							]),
							m('div.five.wide.column', [
								vm.messageFeed.view()
							])
						])
					])
				])
			])
		])
	];
};

module.exports = startups;
