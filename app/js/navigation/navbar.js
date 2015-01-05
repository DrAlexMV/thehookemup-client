var ENTER = require('common/constants').ENTER_KEY;
var NavbarSearchInput = require('navigation/navbar-search-input');
var StreamCommon = require('common/stream-common');
var SearchResults = require('model/search-results');

var Navbar = function () {
	var navbar = {};

	var vm =
	navbar.vm = {
		navbarSearchInput: new NavbarSearchInput()
	};

	navbar.stream = Bacon.mergeAll(vm.navbarSearchInput.stream);

	StreamCommon.on(navbar.stream, 'SearchInput::Search', function (message) {
		m.route(SearchResults.buildURL(message.parameters));
	});

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
