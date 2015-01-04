var ENTER = require('common/constants').ENTER_KEY;
var NavbarSearchInput = require('common/form-builder').inputs.NavbarSearchInput;

var Navbar = function () {
	var navbar = {};

	var vm =
	navbar.vm = {
		navbarSearchInput: new NavbarSearchInput()
	};

	navbar.stream = Bacon.mergeAll(vm.navbarSearchInput.stream);

	navbar.view = function () {
		return [
			m('div.ui.fixed.menu', [
				m('a.item', "The Hook'Em Up"),
				m('div.right.item', [
					vm.navbarSearchInput.view()
				])
			])
		];
	};

	return navbar;
};

module.exports = Navbar;
