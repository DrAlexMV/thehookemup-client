/**
 * Created by austinstone on 2/13/15.
 */

var API = require('common/api');
var User = require('model/user');


var UserActions = function (user) {
	var userActions = {};

	function truncate(string, n) {
		return string.length > n ? string.substr(0, n - 1) + '...' : string;
	}


	var body = [
		m('div.ui.card', [
			m('div.content', [
				m('div.ui.two.column.divided.padded.center.aligned.grid', [
					m('div.column', [
						m('div.ui.vertical.small.basic.buttons', [
							//For some unknown reason, using bind with m.route messes up the url.
							//Putting m.route in a callback function works, however.
							m('div.ui.button', { onclick: function () {
								m.route('/profile/me')
							}}, "Profile"),
							m('div.ui.button', { onclick: function () {
								m.route('/startup-wizard')
							}}, "Create a Startup"),
							m('div.ui.button', { onclick: function () {
								User.logout();
								m.route('/login');
							}
							}, "Logout")
						])
					]),

					m('div.column#user-card', [
						m('img.ui.centered.rounded', { src: user.getPicture() }),
						m('div.description', truncate(user.firstName(), 20))
					])
				])
			])
		])
	];

	userActions.view = function () {
		return [
			m('img.ui.rounded.image', { src: user.getPicture() }),
			m('div#user-actions.menu', [
				body,
				m('div.ui.right.aligned.item', [
					m('a', { href: '/', config: m.route }, [
						'Go to main page'
					])
				])
			])
		];
	};
	return userActions;
};

module.exports = UserActions;
