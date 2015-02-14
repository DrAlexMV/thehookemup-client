var ENTER_KEY = require('common/constants').ENTER_KEY;

var Tagger = function (settings) {
	var tagger = {};

	var vm = {
		tagName: m.prop(''),
		selectedTags: m.prop([]),
		addTag: function () {
			var conditions = [
				!_.contains(vm.selectedTags(), vm.tagName()),
				!_.isNumber(settings.maxCount) || vm.selectedTags().length < settings.maxCount
			];

			if (_.all(conditions)) {
				vm.tagName() && vm.selectedTags().push(vm.tagName());
				vm.tagName('');
			}
		},
		deleteTag: function (index) {
			vm.selectedTags().splice(index, 1);
		}
	};

	var keyHandlers = {};
	keyHandlers[ENTER_KEY] = function (e) {
		vm.addTag();
		e.preventDefault()
	};

	function keyup(e) {
		var action = keyHandlers[e.keyCode];

		if (action) {
			action(e);
		} else {
			m.redraw.strategy('none');
		}
	}

	tagger.view = function (ctrl) {

		vm.selectedTags = ctrl.selectedTags ? ctrl.selectedTags : vm.selectedTags;

		return [
			m('div.fluid.ui.action.small.input.focus', [
				m('input', {
					placeholder: ctrl.placeholder ? ctrl.placeholder : 'Add a category',
					value: vm.tagName(),
					onchange: m.withAttr('value', vm.tagName),
					onkeyup: keyup
				}),
				m('div.ui.right.primary.button', { onclick: vm.addTag }, 'Add')
			]),
			vm.selectedTags().length ?
				m('div.ui.segment', [
					m('div.ui.stackable.grid', [
						m('div.column', [
							m('div', [
								vm.selectedTags().map(function(tag, index) {
									return m('div.ui.label', [
										tag,
										m('i.delete.icon', { onclick: vm.deleteTag.bind(this, index) })
									]);
								})
							])
						])
					])
				]) : null
		];
	};

	return tagger;
};

module.exports = Tagger;