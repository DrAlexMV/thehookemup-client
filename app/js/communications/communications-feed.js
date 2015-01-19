var Pagination = require('common/ui-core/pagination');

var CommunicationsFeed = function () {
	var communicationsFeed = {};

	var vm = {
		communications: m.prop([]),
		pagination: Pagination()
	};

	communicationsFeed.view = function (selected, communications) {

		var contents = function () {
			return [
				m('div.ui.divider'),
				m('div', [
					vm.pagination.view(1)
				])
			];
		};

		return [
			m('div.ui.stacked.segment', [
				m('h3.ui.centered.header', [
					selected
				]),
				m('div.ui.divider'),
				vm.communications().length > 0 ? contents() : m('h4.ui.centered.header', 'Nothing to see here!')
			])
		];
	};

	return communicationsFeed;
};

module.exports = CommunicationsFeed;