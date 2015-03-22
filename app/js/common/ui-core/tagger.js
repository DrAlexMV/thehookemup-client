var Typeahead = require('common/ui-core/typeahead');
var ENTER_KEY = require('common/constants').ENTER_KEY;

//settings has an autocomplete boolean attribute and a maxCount integer, an entity string,
var Tagger = function (settings) {
	var tagger = {};

	var vm = {
		dropdown: m.prop(),
		tagName: m.prop(''),
		selectedTags: m.prop([]),

		addTag: function () {
			var conditions = [
				!_.contains(vm.selectedTags(), vm.tagName()),
					!_.isNumber(settings.maxCount) || vm.selectedTags().length < settings.maxCount
			];
			if (_.all(conditions)) {
				vm.tagName() && vm.selectedTags().push(vm.tagName());
			}
			vm.tagName('');
			settings.autocomplete ? vm.typeahead.clearDropdown() : null;
		},
		deleteTag: function (index) {
			vm.selectedTags().splice(index, 1);
		}
	};

	vm.typeahead = settings.autocomplete ? Typeahead(settings.entity, vm.tagName, vm.addTag) : null;

	var keyHandlers = {};
	keyHandlers[ENTER_KEY] = function (e) {
		vm.addTag();
		e.preventDefault()
	};

	function keyAction(e) {
		var action = keyHandlers[e.keyCode];
		action ? action(e) : null;
		return true;
	}

	function onchange(e) {
		vm.tagName(e.target.value);
		settings.autocomplete ? vm.typeahead.updateDropdown(e.target.value) : null
	}

	tagger.view = function (ctrl) {
		vm.selectedTags = ctrl.selectedTags ? ctrl.selectedTags : vm.selectedTags;
		return [
			m('fluid.ui.action.input.small.focus', [
				m('div.ui.grid', [
					m('div.fourteen.wide.column', {style: {"padding-right": "0px"}}, [
						m('div.suggest-holder', [
							m('input.suggest-prompt', {
								placeholder: ctrl.placeholder ? ctrl.placeholder : 'Add a category',
								oninput: onchange,
								onkeyup: keyAction,
								value: vm.tagName()
							}),
							settings.autocomplete ? vm.typeahead.view() : null
						])
					]),
					m('div.two.wide.column', {style: {"padding-right": "0px"}}, [
						m('div.ui.right.primary.button', { onclick: vm.addTag }, 'Add')
					])
				])
			]),
			vm.selectedTags().length ?
				m('div.ui.segment.skill-tags', [
					m('div.ui.stackable.grid', [
						m('div.column', [
							m('div', [
								vm.selectedTags().map(function (tag, index) {
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

