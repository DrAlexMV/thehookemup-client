var User = require('model/user');
var FollowCount = require('gamification/follows/follow-count');

var UserListBig = function (users) {
	var userList = {};

	var vm = {
		followCount: FollowCount()
	};

	userList.view = function () {
		var card = function (user) {
			return [
				m('div.item', [
					m('div.ui.card', [
						m('div.ui.tiny.image', [
							m('img', { src: User.getPicture(user) })
						]),
						m('div.content', [
							m('div.name-header', [
								m('a.ui.header', { href: '/profile/' + user._id(), config: m.route }, [
									User.getName(user),
									m('div.ui.label.right.floated', vm.followCount.view())
								]),
								m('div.ui.meta', user.roles().join(", "))
							])
						]),
						m('div.description', user.description())
					])
				])
			];
		};

		return [
			m('div.search-list', [
				users.map(function (user) { return card(user); })
			])
		]
	};

	return userList;
};

module.exports = UserListBig;
