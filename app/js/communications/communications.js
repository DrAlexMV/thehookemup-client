var CommunicationsMenu = require('communications/communications-menu');
var CommunicationsFeed = require('communications/communications-feed');
var Context = require('common/context');
var StreamCommon = require('common/stream-common');
var ConnectionRequestCommunication = require('communications/connection-request-communication');



var communications = {};

communications.stream = Bacon.mergeAll(Context.stream);

var vm =
communications.vm = {
	init: function () {
		var vm = this;

		vm.menu = CommunicationsMenu();
		vm.feed = CommunicationsFeed();
		vm.connectionRequestCommunications = m.prop([]);
		vm.selected = m.prop('Requests');
    vm.currentUserEdges  = null;

		return vm;
	}
};

/*


StreamCommon.on(communications.stream, 'Context::Login', function (message) {
  communications.updateEdges();
  communications.loadCommunications();
});

communications.loadCommunications = function () {
  vm.connectionRequestCommunications(vm.currentUserEdges.map(function (edges) {
    var user = edges().pendingConnections();
    var message = edges().pendingConnectionsMessages()[user._id()];
    return ConnectionRequestCommunication(user, message)
  }))
};

communications.updateEdges = function () {
  Context.getCurrentUserEdges().then(
    function(edgesProp) {
      vm.currentUserEdges = edgesProp;
    }, Error.handle);
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
				vm.feed.view(vm.selected(), vm.connectionRequestCommunications())
			])
		])
	];
};
*/
module.exports = communications;