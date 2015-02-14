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

				var messageView = null;

				//Did this user send a message?
				var connectMessage = edges().pendingConnectionsMessages()[user._id()];
				if (connectMessage) {
					messageView = [
						//TODO: figure out how to hyphenate the message. Standard hyphens: auto causes overflow
						m('div[style=word-break: break-all; white-space: normal;]', [
							truncate(connectMessage, 85),
						])
					];
				}

				return [
					m('div.event', [
						m('div.label', m('img.profile-picture', { src: user.getPicture() })),
						m('div.content', [
							m('div.summary', [
								m('a.user', {href: '/profile/' + user._id(), config: m.route}, [
									truncate(user.getName(), 18)
								]), ' wants to connect'
							]),
							m('div.extra.text', messageView),
							m('div.meta', [
								m('div.ui.negative.small.button', {
									onclick: respond.bind(respond, 'NoConnect', user._id(), idx)
								}, 'Not Now'),
								m('div.ui.positive.right.labeled.icon.small.button', {
									onclick: respond.bind(respond, 'Connect', user._id(), idx)
								}, 'Connect', [
									m('i.checkmark.icon')
								])
							])
						])
					])
				];
			});
		}

		var numPending = edges().pendingConnections().length;
		var newNotifsBubble = null;
		var listObject = null;
		if (numPending == 0) {
			listObject = [
				m('div.ui.card', [
					m('div.content', [
						m('div.description', 'You don\'t have any new notifications.')
					])
				])
			];
		} else {
			listObject = m('div#nav-notifcation-list.ui.feed', list);
			newNotifsBubble = m('div.floating.ui.red.mini.label', numPending);
		}

		return [
			m('i.alarm.outline.icon'), newNotifsBubble,
			m('div.menu', [
				listObject,
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
