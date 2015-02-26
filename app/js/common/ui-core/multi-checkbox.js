var checkbox = require('common/form-builder').inputs.checkbox;
var Message = require('common/stream-common').Message;
var PopupLabel = require('common/ui-core/popup-label');

var MultiCheckbox = function () {
	var multiCheckbox = {};

	multiCheckbox.stream = new Bacon.Bus();

	var vm = {
		selected: m.prop([]),
		choices: m.prop(),
		selectChoice: function (choice) {
			if (_.contains(vm.selected(), choice)) {
				vm.selected(_.pull(vm.selected(), choice));
			} else {
				vm.selected().push(choice);
			}

			multiCheckbox.stream.push(new Message('Change::MultiCheckbox', { choices: vm.selected() }));
		}
	};

	multiCheckbox.view = function (choices) {
		vm.choices(choices ? choices : []);

		return [
			m('div', [
				vm.choices().map(function (choice) {
					return m('div.field', {
							'data-variation': 'inverted',
							'data-content': choice.description,
							'data-position': 'top center',
							config: PopupLabel
						}, [
							checkbox(choice.name, { onchange: vm.selectChoice.bind(this, choice.name) })
					]);
				})
			])
		];
	};

	return multiCheckbox;
};

module.exports = MultiCheckbox;