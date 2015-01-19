var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');
var UtilsGeneral = require('common/utils-general');
var ConnectMessage = require('navigation/connect-message');
var ModalMixin = require('common/modal-mixin');

/*
  Notification can be a request to connect
 */

var NotificationList = function (edges) { // edges is an m.prop
	var notificationList = {};

	//currently unused
	notificationList.stream = m.prop(new Bacon.Bus());

  //need an empty modal at first, since we don't know which modal we need until the user actually clicks the button
  var messageModal = m.prop({
    view: function(){}
  });

  function viewMessage(user,userIndex) {

    /*notificationList.stream.push(
      new StreamCommon.Message('NotificationList::ViewMessage', { user: user })
    );*/

    var message = edges().pendingConnectionsMessages()[user._id()];

    messageModal(new ModalMixin(new ConnectMessage(m.prop(user),message)));
    messageModal().vm.open();
    //not sure why this is necessary, but for some reason all user info disappears from the list without it,
    //but the list still displays (just with empty names) and checking the data in the console verifies it is still there.
    m.redraw.strategy("all");
    notificationList.stream(Bacon.mergeAll(messageModal().vm.body.stream));

    //For some reason, this message is generated whenever the modal is opened, and not when the button on the modal is clicked.
    //I can't figure out why this would be the case.
    //StreamCommon.on(notificationList.stream(), 'ConnectMessageModal::Connect', console.log('heard message from connect message modal'))//respond("Connect", user._id(), userIndex ));

  }

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

				notificationList.stream().push(
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

				notificationList.stream().push(
					new StreamCommon.Message('NotificationList::NoConnect', { user: user })
				);
			});
		}
	}

	function truncate(string, n) {
		return string.length > n ? string.substr(0, n-1) + '...': string + '!';
	}

	notificationList.view = function () {
		var list = [];

		if (edges().pendingConnections()) {
			list = edges().pendingConnections().map(function (user, idx) {

        viewMessageButton = {};

        //Did this user send a message?
        if(edges().pendingConnectionsMessages()[user._id()] && edges().pendingConnectionsMessages()[user._id()]!='')
        {
          viewMessageButton = [m('br'),
                               m('div.fluid.ui.button',{onclick: viewMessage.bind(viewMessage,user,idx)},"View message")]
        }


				return [
					m('div.item', [
						m('div.ui.card', [
							m('div.content', [
								m('div.header', [
									m('img.ui.avatar.image', { src: User.getPicture(user) }),
										m('a', {href: '/profile/' + user._id() }, {config: m.route}, [
											'Request from ' + truncate(User.getName(user),14)
										])
                  ]),
                  m('div.ui.center.aligned.segment',[
								  m('div.description', 'Would you like to connect?'),
                  viewMessageButton,
                  m('br'),
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
    {style: {border: "1px solid red"}}
		return [ messageModal().view(),
      m('i.alarm.icon'), numPending,
      m("div.menu[style='overflow:auto;max-height:500px;']",
        [list])
    ]
	};

	return notificationList;
};

module.exports = NotificationList;
