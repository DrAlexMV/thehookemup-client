var User = require('model/user');
var EndorsementCount = require('engagement/endorsements/endorsement-count');

var UserListBig = function (users) {
	var userList = {};

	userList.view = function () {
		var card = function (user) {
			return [
				m('div.item', [
					m('div.ui.card', [
						m('div.ui.tiny.image', [
							m('img', { src: user.getPicture() })
						]),
						m('div.content', [
							m('div.name-header', [
								m('a.ui.header', { href: '/profile/' + user._id(), config: m.route }, [
									user.getName(),
									m('div.ui.right.floated', EndorsementCount(null, user.endorsementCount).view())
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
				users.map(card)
			])
		]
	};

	return userList;
};

module.exports = UserListBig;
