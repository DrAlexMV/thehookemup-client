var StartupFounders = function () {
	var startupFounders = {};

	var vm = {

	};

	startupFounders.view = function () {
		return [
			m('div.ui.segment', [
				m('div.ui.header', [
					'Founders'
				]),
				m('div.ui.divider')
			])
		];
	};

	return startupFounders;
};

module.exports = StartupFounders;
