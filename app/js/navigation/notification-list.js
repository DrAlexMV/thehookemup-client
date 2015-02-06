var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');


//TODO: Get auto hyphenation of messages to work.

/*
 Notification can be a request to connect
 */

var NotificationList = function (edges) { // edges is an m.prop
	var notificationList = {};

	//currently unused
	notificationList.stream = m.prop(new Bacon.Bus());

	function respond(response, userId, userIndex) {
		/*response is Connect or NoConnect whether the request was accepted*/
		if (response === 'Connect') {
			var user = edges().pendingConnections()[userIndex];

			UserEdges.connectMe(userId).then(function (response) {
				var es = edges();
				var cs = es.connections();
				cs.push(user);
				es.connections(cs);

				var pc = es.pendingConnections();
				pc.splice(userIndex, 1);
				es.pendingConnections(pc);

				Context.setCurrentUserEdges(es);

				notificationList.stream().push(
					new StreamCommon.Message('NotificationList::Connect', { user: user })
				);
			});
		} else if (response === 'NoConnect') {
			UserEdges.deleteConnection(userId).then(function () {
				var es = edges();
				var pc = es.pendingConnections();
				pc.splice(userIndex, 1);
				es.pendingConnections(pc);

				Context.setCurrentUserEdges(es);

				notificationList.stream().push(
					new StreamCommon.Message('NotificationList::NoConnect', { user: user })
				);
			});
		}
	}

	function truncate(string, n) {
		return string.length > n ? string.substr(0, n - 1) + '...' : string;
	}

	notificationList.view = function () {
		var list = null;

		if (edges().pendingConnections()) {
			list = edges().pendingConnections().map(function (user, idx) {

				var messageView = {};

				//Did this user send a message?
				if (edges().pendingConnectionsMessages()[user._id()] && edges().pendingConnectionsMessages()[user._id()] != '') {
					var message = edges().pendingConnectionsMessages()[user._id()];
					messageView = [
						//TODO: figure out how to hyphenate the message. Standard hyphens: auto causes overflow
						m("div.content", [
							m("div[style=word-break: break-all; white-space: normal;]", [
								m("i.quote.left.icon"),
								truncate(message, 85),
								m("i.quote.right.icon")
							])
						]),
						m("div.ui.divider")
					];
				}

				return [
					m('div.ui.segment', [
						m('div.ui.card[style=border: 1px solid Gainsboro;]', [
							m('div.content', [
								m('div.header', [
									m('img.ui.avatar.image', { src: User.getPicture(user) }),
									m('a', {href: '/profile/' + user._id(), config: m.route}, [
											'Request from ' + truncate(User.getName(user), 14)
									])
								]),
								m('div.ui.center.aligned.segment[style=border: 1px solid Gainsboro;]', [
									messageView,
									m('div.description', 'Would you like to connect?'),
									m("br"),

									m('div.ui.padded.grid', [
										m('div.ui.center.aligned.one.column.row',[
										m("div.ui.black.button", {onclick: respond.bind(respond, 'NoConnect', user._id())}, "Not Now"),
										m("div.ui.positive.right.labeled.icon.button", {onclick: respond.bind(respond, 'Connect', user._id())}, "Connect", [
											m("i.checkmark.icon")])
										])
									])
								])
							])
						])
					])
				];
			});
		}

		var numPending = edges().pendingConnections().length;
		var newNotifsBubble = null;
		if (numPending == 0) {
			list = [
				m('div.item', [
					m('div.ui.card', [
						m('div.content', [
							m('div.description', 'You don\'t have any new notifications.')
						])
					])
				])
			];
		} else {
			newNotifsBubble = m('div.floating.ui.red.mini.label', numPending);
		}

		return [
			m('i.alarm.outline.icon'), newNotifsBubble,
			m('div.menu', [
				m('div', [
					m('div#nav-notification-list', [
						list
					])
				]),

				m('div.ui.right.aligned.item', [
					m('a', { href: '/notifications/', config: m.route }, [
						'See all'
					])
				])
			])

		]
	};

	return notificationList;
};

module.exports = NotificationList;
