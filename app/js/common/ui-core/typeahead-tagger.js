var autocompleteResults = require('model/autocomplete-results');
var ENTER_KEY = require('common/constants').ENTER_KEY;

var TypeaheadTagger = function (settings, entity) {
	var typeaheadTagger = {};

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
				vm.tagName('');
				document.getElementById("inputValue").value = ''
			}
		},
		deleteTag: function (index) {
			vm.selectedTags().splice(index, 1);
		}
	};

	var keyHandlers = {};
	keyHandlers[ENTER_KEY] = function (e) {
		vm.tagName(document.getElementById("inputValue").value)
		vm.addTag();
		e.preventDefault()
	};

	function keyAction(e) {
		console.log("in key action");
		var action = keyHandlers[e.keyCode];
		action ? action(e) : m.redraw.strategy('none');
		var s = document.getElementById("inputValue").value;
		vm.dropdown([]);

		if (s != '') {
			autocompleteResults.getSuggestions(entity, {
				text: s,
				results: 5
			}).then(function (results) {
				if (results.length != 0) {
					vm.dropdown(
						m("ul", [
							results.map(function (result) {
								return [
									m("li", {
										onclick: function () {
											document.getElementById("inputValue").value = result['text'];
											vm.tagName(result['text']);
											vm.dropdown([]);
											vm.addTag();
										}
									}, [
										m("span.suggest-name", result['text']),
										m("span.suggest-description", "Popularity: " + result['score'])
									])
								];
							})
						])
					);
				}
			})
		}
	}

	typeaheadTagger.view = function (ctrl) {
		vm.selectedTags = ctrl.selectedTags ? ctrl.selectedTags : vm.selectedTags;
		return [
			m('fluid.ui.action.input.small.focus', [
				m('div.ui.grid', [
					m('div.fourteen.wide.column', {style: {"padding-right": "0px"}}, [
						m('div.suggest-holder', [
							m('input.suggest-prompt', {
								placeholder: ctrl.placeholder ? ctrl.placeholder : 'Add a category',
								onchange: m.withAttr('value', vm.tagName),
								onkeyup: keyAction,
								onkeypress: keyAction,
								id: "inputValue"
							}),
							vm.dropdown()
						])
					]),
					m('div.two.wide.column', {style: {"padding-right": "0px"}}, [
						m('div.ui.right.primary.button', { onclick: vm.addTag }, 'Add')
					])
				])
			]),
			vm.selectedTags().length ?
				m('div.ui.segment', [
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
	return typeaheadTagger;
};

module.exports = TypeaheadTagger;

