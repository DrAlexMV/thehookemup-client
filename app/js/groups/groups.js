var MessageFeed = require('groups/message-feed');

var groups = {};

var vm =
groups.vm = {
	init: function () {
		vm.messageFeed = MessageFeed();
	}
};

groups.controller = function () {
	vm.init();
};

groups.view = function () {
	return [
		vm.messageFeed.view()
	];
};

module.exports = groups;
