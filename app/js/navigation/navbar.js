var NavbarSearchInput = require('navigation/navbar-search-input');
var StreamCommon = require('common/stream-common');
var SearchResults = require('model/search-results');
var Context = require('common/context');
var User = require('model/user');
var UserModel = User.UserModel;
var Image = require('model/image');
var NotificationList = require('navigation/notification-list');
var UserActions = require('navigation/user-actions-dropdown');
var DropdownMixin = require('common/dropdown-mixin');
var Endorsements = require('model/endorsements');
var UserEdges = require('model/user-edges');

var Navbar = function () {

    var navbar = {};
    var vm = navbar.vm = {
        navbarSearchInput: new NavbarSearchInput(),
        currentUser: m.prop(new UserModel({})),
        currentUserEdges: null,
        notificationDropdown: m.prop(),
        userActionsDropdown: m.prop()
    };

    navbar.stream = Bacon.mergeAll(Context.stream, vm.navbarSearchInput.stream);

    function updateEdges() {
        Context.getCurrentUserEdges().then(
            function (edgesProp) {
                navbar.vm.currentUserEdges = edgesProp;
                navbar.vm.notificationDropdown(DropdownMixin(NotificationList(edgesProp),
                    'div.ui.icon.top.right.pointing.dropdown.basic.button'));
            }, Error.handle);
    }

    updateEdges();

    StreamCommon.on(navbar.stream, 'SearchInput::Search', function (message) {
        m.route(SearchResults.buildURL(message.parameters));
    });

    StreamCommon.on(navbar.stream, 'Context::Login', function (message) {
        navbar.vm.currentUser(message.parameters.user);
        Endorsements().getEntityEndorsementCount(navbar.vm.currentUser()._id()).then(function (countModel) {
            //populate endorsement count for usage in the user action dropdown
            navbar.vm.currentUser().endorsementCount(countModel.endorsers());
            navbar.vm.userActionsDropdown(DropdownMixin(UserActions(navbar.vm.currentUser()),
                'div.ui.top.right.pointing.dropdown'));
            updateEdges();
        });

    });

    navbar.view = function () {
        return [
            m('div.ui.borderless.fixed.menu', [
                m('div.ui.grid', [
                    m('div.two.wide.center.aligned.column', [
                        m('a[href="?/"].item#nav-home', { config: m.route }, [
                            m('i.home.icon')
                        ])
                    ]),
                    m('div.eight.wide.column', [
                        m('div.item#nav-search', [
                            vm.navbarSearchInput.view()
                        ])
                    ]),
                    m('div.six.wide.column', [
                        m('div.right.item#user-box', [
                            vm.userActionsDropdown() ? vm.userActionsDropdown().view() : null
                        ]),

                        m('div.right.item#notifs-button', [
                            vm.notificationDropdown() ? vm.notificationDropdown().view() : null
                        ])
                    ])
                ])
            ])
        ];
    };

    return navbar;
};

module.exports = Navbar;
