var Tagger = require('common/ui-core/tagger');

var StartupWizardMarkets = function () {
	var markets = {};

	var vm = {
		tagger: Tagger({ maxCount: 4 })
	};

	markets.view = function (ctrl) {
		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label', 'Markets'),
				m('div.ui.hidden.divider'),
				vm.tagger.view({ selectedTags: ctrl.markets })
			])
		];
	};

	return markets;
};

module.exports = StartupWizardMarkets;
