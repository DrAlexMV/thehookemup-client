var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');


var ConnectionRequest = function (user, message) {


  var connectionRequest = {};

  //need this to save the userId so we can know to remove this item when a response button is clicked
  connectionRequest.userId =  user._id();


  connectionRequest.stream = new Bacon.Bus();

  var respond = function (response, userId) {
    console.log('ConnectionRequest::' + response);
    connectionRequest.stream.push(
      new StreamCommon.Message('ConnectionRequest::' + response, { userId: userId })
    );
  };

  connectionRequest.view = function () {

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
        m('a', {href: '/profile/' + user._id(), config: m.route}, [
          m("div.ui.center.aligned.header", user.firstName() + " " + user.lastName() + " would like to connect with you.")
        ]),
        m("div.ui.padded.grid", [
          m("div.row", [
            m("div.three.wide.column", [
              m("div.content", [
                m('a', {href: '/profile/' + user._id(), config: m.route}, [
                  m("div.ui.tiny.bordered.image", [
                    m('img.ui.tiny.image', { src: user.getPicture() })
                  ])
                ])
              ]),
              m("div.ui.meta[style=color:Gainsboro;]", user.roles().join(", "))
            ]),
            m("div.thirteen.wide.column", [
              m("div.field[style=height:60px;]", [
                m("div.center.aligned.ui", [
                  truncate(message, 205)
                ])
              ]),
              m("div.ui.padded.grid[style=height:35px;]", [
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
        m('a', {href: '/profile/' + user._id(), config: m.route}, [
          m("div.center.aligned.ui.header", user.firstName() + " " + user.lastName() + "would like to connect with you.")
        ]),
        m("div.ui.padded.grid", [
          m("div.five.wide.column", [
            m("div.content", [
              m('a', {href: '/profile/' + user._id(), config: m.route}, [
                m("div.ui.tiny.bordered.image", [
                  m('img.ui.tiny.image', { src: user.getPicture() })
                ])
              ])
            ]),
            m("div.ui.meta[style=color:Gainsboro;]", user.roles().join(", "))
          ]),
          m("div.eleven.wide.column", [

            _.range(0, 2, 1).map(function () {
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

  return connectionRequest;
};

module.exports = ConnectionRequest;