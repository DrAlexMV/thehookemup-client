var ENTER = require('common/constants').ENTER_KEY;
var NavbarSearchInput = require('navigation/navbar-search-input');
var StreamCommon = require('common/stream-common');
var SearchResults = require('model/search-results');
var Context = require('common/context');
var User = require('model/user');
var UserModel = User.UserModel;
var Image = require('model/image');
var NotificationList = require('navigation/notification-list');
var DropdownMixin = require('common/dropdown-mixin')
var UserEdges = require('model/user-edges');
var Navbar = function () {

	var navbar = {};
	var vm = navbar.vm = {
		navbarSearchInput: new NavbarSearchInput(),
		currentUser: m.prop(new UserModel({})),
    dropdownMixin: m.prop(DropdownMixin(NotificationList([]),'div.ui.icon.top.right.pointing.dropdown.button')),
    pendingConnections: []
	};

	navbar.stream = Bacon.mergeAll(Context.stream, vm.navbarSearchInput.stream);


	StreamCommon.on(navbar.stream, 'SearchInput::Search', function (message) {
		m.route(SearchResults.buildURL(message.parameters));
	});


	StreamCommon.on(navbar.stream, 'Context::Login', function (message) {
		vm.currentUser(message.parameters.user);
    UserEdges.getMyPendingConnections().then(
      function(response) {
        vm.pendingConnections = response;
        vm.dropdownMixin(DropdownMixin(NotificationList(vm.pendingConnections), 'div.ui.icon.top.right.pointing.dropdown.button'));

      }, Error.handle);
	});


	navbar.view = function () {
		return [
			m('div.ui.borderless.fixed.menu', [
				m('div.ui.grid', [
					m('div.two.wide.center.aligned.column', [
						m('a.item', [
							m('i.lemon.icon')
						])
					]),
					m('div.seven.wide.column', [
						m('div.item#nav-search', [
							vm.navbarSearchInput.view()
						])
					]),
					m('div.seven.wide.column', [
						m('div.right.item', [
            vm.dropdownMixin().view(),
							  m('div.ui.image.label', [
								  m('img', { src: User.getPicture(vm.currentUser()) }),
								  vm.currentUser().email()
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
