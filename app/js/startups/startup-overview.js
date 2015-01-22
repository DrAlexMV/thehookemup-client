var StartupOverview = function () {
	var startupOverview = {};

	var vm = {

	};

	startupOverview.view = function () {
		return [
			m('div.ui.segment', [
				m('div.ui.header', [
					'Overview'
				]),
				m('div.ui.divider')
			])
		];
	};

	return startupOverview;
};

module.exports = StartupOverview;