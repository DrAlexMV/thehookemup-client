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
				m('div.ui.grid', [
					m('div.eight.wide.center.aligned.column', [
						m('div.ui.vertical.buttons', [
							//For some unknown reason, using bind with m.route messes up the url.
							//Putting m.route in a callback function works, however.
							m('div.ui.small.button', { onclick: function () {
								m.route('/profile/me')
							}}, "Profile"),
							m('div.ui.small.button', { onclick: function () {
								m.route('/startup-wizard')
							}}, "Create a Startup"),
							m('div.ui.small.button', { onclick: function () {
								User.logout();
								m.route('/login');
							}
							}, "Logout")
						])
					]),

					m('div.eight.wide.center.aligned.column', [
						m('div.description', truncate(user.getName(), 20)),
						m('br'),
						m("img.ui.centered.tiny.rounded.image[style='height:60px;width:60px']", { src: user.getPicture() }),
					])
				])
			])
		])
	];

	userActions.view = function () {
		return [
			m('img.ui.small.rounded.image[style="height:20px;width:20px"]', { src: user.getPicture() }),
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
