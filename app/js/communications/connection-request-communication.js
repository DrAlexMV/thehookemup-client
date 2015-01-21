var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');




var ConnectionRequestCommunication = function (user, message) {

	var connectionRequestCommunication = {};

	connectionRequestCommunication.view = function () {

    messageView = [];
    if (message!=undefined && message!=null && message!='') {
      messageView = [
        //TODO: figure out how to hyphenate the message. Standard hyphens: auto causes overflow
        m("div.content", [
          m("div", [
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
              m('a', {href: '/profile/' + user._id() }, {config: m.route}, [
                  'Request from ' + truncate(User.getName(user), 14)
              ])
            ]),
            m('div.ui.center.aligned.segment[style=border: 1px solid Gainsboro;]', [
              messageView,
              m('div.description', 'Would you like to connect?'),
              m("br"),

              m('div.ui.two.bottom.attached.buttons', [
                m('div.ui.green.button', 'Yes'),
                m('div.ui.red.button', 'No')
              ])
            ])
          ])
        ])
      ])
    ];
	};

	return connectionRequestCommunication;
};

module.exports = ConnectionRequestCommunication;