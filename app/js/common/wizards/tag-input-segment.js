var TypeaheadTagger = require('common/ui-core/typeahead-tagger');
var Tagger = require('common/ui-core/tagger');

var TagInputSegment = function (props) {
	var tagInputSegment = {};

	var vm = {};
	vm.tagger = props.entity ? TypeaheadTagger({ maxCount: props.maxCount }, props.entity) : Tagger({ maxCount: props.maxCount });

	tagInputSegment.view = function () {
		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label', props.ribbonLabel),
				m('div.ui.hidden.divider'),
				vm.tagger.view({ selectedTags: props.tagState, placeholder: props.placeholder})
			])
		];
	};
	return tagInputSegment;
};

module.exports = TagInputSegment;

