var ENTER = require('common/constants').ENTER_KEY;
var NavbarSearchInput = require('navigation/navbar-search-input');
var StreamCommon = require('common/stream-common');
var SearchResults = require('model/search-results');
var Context = require('common/context');
var User = require('model/user');
var UserModel = User.UserModel;
var Image = require('model/image');

var Navbar = function () {

	var navbar = {};

	var vm =
	navbar.vm = {
		navbarSearchInput: new NavbarSearchInput(),
		currentUser: m.prop(new UserModel({}))
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
			m('div.ui.borderless.fixed.menu', [
				m('div.ui.grid', [
					m('div.two.wide.center.aligned.column', [
						m('a[href="?/"].item', [
							m('i.lemon.icon')
						])
					]),
					m('div.seven.wide.column', [
						m('div.item#nav-search', [
							vm.navbarSearchInput.view()
						])
					]),
					m('div.seven.wide.column', [
						m('div#nav-avatar.right.item', [
							m('a[href="?/profile/me"].ui.avatar.image', [
								m('img', { src: User.getPicture(vm.currentUser()) })
							])
						])
					])
				])
			])
		];
	};

	return navbar;
};

module.exports = Navbar;
