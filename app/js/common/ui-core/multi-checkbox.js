var checkbox = require('common/form-builder').inputs.checkbox;
var Message = require('common/stream-common').Message;

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
					return m('div.field', [
						checkbox(choice, { onchange: vm.selectChoice.bind(this, choice) })
					])
				})
			])
		];
	};

	return multiCheckbox;
};

module.exports = MultiCheckbox;