var Tagger = require('common/ui-core/tagger');

var TagInputSegment = function (settings) {
	var tagInputSegment = {};

	var vm = {};
	vm.tagger = Tagger({
		maxCount: settings.maxCount,
		autocomplete: settings.autocomplete,
		entity: settings.entity
	});

	tagInputSegment.view = function () {
		return [
			m('div.ui.segment', [
				m('div.ui.ribbon.label.theme-color-main', settings.ribbonLabel),
				m('div.ui.hidden.divider'),
				vm.tagger.view({ selectedTags: settings.tagState, placeholder: settings.placeholder})
			])
		];
	};
	return tagInputSegment;
};

module.exports = TagInputSegment;

