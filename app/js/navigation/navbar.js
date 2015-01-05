var ENTER = require('common/constants').ENTER_KEY;
var NavbarSearchInput = require('navigation/navbar-search-input');
var StreamCommon = require('common/stream-common');
var SearchResults = require('model/search-results');
var Context = require('common/context');

var Navbar = function () {
	var navbar = {};

	var vm =
	navbar.vm = {
		navbarSearchInput: new NavbarSearchInput(),
		currentUser: m.prop()
	};

	navbar.stream = Bacon.mergeAll(Context.stream, vm.navbarSearchInput.stream);

	StreamCommon.on(navbar.stream, 'SearchInput::Search', function (message) {
		m.route(SearchResults.buildURL(message.parameters));
	});

	StreamCommon.on(navbar.stream, 'Context::Login', function (message) {
		vm.currentUser(message.parameters.user);
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
