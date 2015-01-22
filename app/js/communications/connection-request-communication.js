var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');


var ConnectionRequestCommunication = function (user, message) {


  var connectionRequestCommunication = {};

  //need this to save the userId so we can know to remove this item when a response button is clicked
  connectionRequestCommunication.vm = {
    userId: user._id()
  };

  connectionRequestCommunication.stream = new Bacon.Bus();

  var respond = function (response, userId) {
    console.log('ConnectionRequestCommunication::' + response);
    connectionRequestCommunication.stream.push(
      new StreamCommon.Message('ConnectionRequestCommunication::' + response, { userId: userId })
    );
  };

  connectionRequestCommunication.view = function () {

    function truncate(string, n) {
      return string.length > n ? [
        m("div.content", [
          m("i.quote.left.icon"),
          string.substr(0, n - 1) + '... ',
          m("div.mini.ui.button", "See all"),
          m("i.quote.right.icon")
        ])
      ] : [
        m("div.content", [
          m("i.quote.left.icon"),
          string,
          m("i.quote.right.icon")
        ])
      ]
    }

    if (message != undefined && message != '' && message != null) {
      return [
        m("div.ui.padded.grid", [
          m("div.row", [
            m("div.five.wide.column", [
              m("div.content", [
                m('a', {href: '/profile/' + user._id(), config: m.route}, [
                  m("div.ui.medium.bordered.image", [
                    m('img.ui.medium.image', { src: User.getPicture(user) })
                  ])
                ])
              ])
            ]),
            m("div.eleven.wide.column", [
              m('a', {href: '/profile/' + user._id(), config: m.route}, [
                m("div.ui.header", user.firstName() + " " + user.lastName() + " would like to connect with you.")
              ]),
              m('br'),
              m("div.ui.meta[style=color:Gainsboro;]", user.roles().join(", ")),
              m('br'),
              m("div.field[style=height:80px;]", [
                m("div.center.aligned.ui.segment", [
                  truncate(message, 100)
                ])
              ]),
              m("div.ui.padded.grid", [
                m("div.right.aligned.one.column.row", [
                  m("div.ui.black.button", {onclick: respond.bind(respond, 'NoConnect', user._id())}, "Not Now"),
                  m("div.ui.positive.right.labeled.icon.button", {onclick: respond.bind(respond, 'Connect', user._id())}, "Connect", [
                    m("i.checkmark.icon")
                  ])
                ])
              ])
            ])
          ])
        ])
      ];
    }
    else { //no message
      return [
        m("div.ui.padded.grid", [
          m("div.five.wide.column", [
            m("div.content", [
              m('a', {href: '/profile/' + user._id(), config: m.route}, [
                m("div.ui.medium.bordered.image", [
                  m('img.ui.medium.image', { src: User.getPicture(user) })
                ])
              ])
            ])
          ]),
          m("div.eleven.wide.column", [
            m('a', {href: '/profile/' + user._id(), config: m.route}, [
              m("div.ui.header", user.firstName() + " " + user.lastName() + "would like to connect with you.")
            ]),
            m("br"),
            m("div.ui.meta[style=color:Gainsboro;]", user.roles().join(", ")),
            _.range(0, 4, 1).map(function () {
              return m('br')
            }),
            m("div.ui.padded.grid", [
              m("div.right.aligned.one.column.row", [
                m("div.ui.black.button", {onclick: respond.bind(respond, 'NoConnect', user._id())}, "Not Now"),
                m("div.ui.positive.right.labeled.icon.button", {onclick: respond.bind(respond, 'Connect', user._id())}, "Connect", [
                  m("i.checkmark.icon")
                ])
              ])

            ])
          ])
        ])
      ];
    }
  };

  return connectionRequestCommunication;
};

module.exports = ConnectionRequestCommunication;