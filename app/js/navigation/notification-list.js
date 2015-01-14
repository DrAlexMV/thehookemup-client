var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');
var UtilsGeneral = require('common/utils-general');


/*
  Notification can be a request to connect
 */

var NotificationList = function (edges) { // edges is an m.prop
	var notificationList = {};

	//currently unused
	notificationList.stream = new Bacon.Bus();

	function respond(response, userId, userIndex) {
		/*response is yes or no whether the request was accepted*/
		if (response === 'Connect') {
			var user = edges().pendingConnections()[userIndex];

			UserEdges.connectMe(userId).then(function(response) {
				var es = edges();
				var cs = es.connections();
				cs.push(user);
				es.connections(cs);

				var pc = es.pendingConnections();
				pc.splice(userIndex, 1);
				es.pendingConnections(pc);

				Context.setCurrentUserEdges(es);

				notificationList.stream.push(
					new StreamCommon.Message('NotificationList::Connect', { user: user })
				);
			});
		} else if (response === 'NoConnect') {
			UserEdges.deleteConnection(userId).then(function() {
				var es = edges();
				var pc = es.pendingConnections();
				pc.splice(userIndex, 1);
				es.pendingConnections(pc);

				Context.setCurrentUserEdges(es);

				notificationList.stream.push(
					new StreamCommon.Message('NotificationList::NoConnect', { user: user })
				);
			});
		}
	}

	function truncate(string, n){
		return string.length > n ? string.substr(0, n-1) + '...': string + '!';
	}

	notificationList.view = function () {
		var list = [];

		if (edges().pendingConnections()) {
			list = edges().pendingConnections().map(function (user, idx) {
				console.log(User.getName(user));
				return [
					m('div.item', [
						m('div.ui.card', [
							m('div.content', [
								m('div.header', [
									m('img.ui.avatar.image', { src: User.getPicture(user) }),
										m('a', {href: '/profile/' + user._id() }, {config: m.route}, [
											'Request from ' + truncate(User.getName(user),14)
										]),
									m('p',[
										m('div.description', 'Would you like to connect?')
									]),
									m('div.ui.two.bottom.attached.buttons', [
										m('div.ui.green.button', {onclick: respond.bind(respond, 'Connect', user._id(), idx)}, 'Yes'),
										m('div.ui.red.button', {onclick: respond.bind(respond, 'NoConnect', user._id(), idx)}, 'No')
									])
								])
							])
						])
					])
				];
			});
		}

		var numPending = edges().pendingConnections().length;
		if (numPending === 0) {
			return [
				m('i.alarm.outline.icon'),
				m('div.menu', [
					m('div.item', [
						m('div.ui.card', [
							m('div.content', [
								m('div.description', 'You don\'t have any notifications right now.')
							])
						])
					])
				])
			];
		}
		return [ m('i.alarm.icon'), numPending, m('div.menu', [list]) ];
	};

	return notificationList;
};

module.exports = NotificationList;
