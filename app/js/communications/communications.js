var CommunicationsMenu = require('communications/communications-menu');
var CommunicationsFeed = require('communications/communications-feed');

var communications = {};

var vm =
communications.vm = {
	init: function () {
		var vm = this;

		vm.menu = CommunicationsMenu();
		vm.feed = CommunicationsFeed();
		vm.communications = m.prop([]);
		vm.selected = m.prop('Requests');

		return vm;
	}
};

communications.controller = function () {
	communications.vm.init();
};

communications.view = function () {
	return [
		m('div.ui.stackable.page.grid', [
			m('div.three.wide.column', [
				vm.menu.view()
			]),
			m('div.thirteen.wide.column', [
				vm.feed.view(vm.selected(), vm.communications())
			])
		])
	];
};

module.exports = communications;