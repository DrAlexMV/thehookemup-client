/**
 * Created by austinstone on 1/22/15.
 */

var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');


var ConversationPreview = function (message, user) {

  var conversationPreview = {};


  conversationPreview.stream = new Bacon.Bus();

  /*var respond = function (response, userId) {
   console.log('ConnectionRequestCommunication::' + response);
   connectionRequestCommunication.stream.push(
   new StreamCommon.Message('ConnectionRequestCommunication::' + response, { userId: userId })
   );
   };*/

  conversationPreview.view = function () {

    function truncate(string, n) {
      return string.length > n ? [
        m("div.content[style=color:Gainsboro;]", [
          m("i.quote.left.icon"),
            string.substr(0, n - 1) + '... ',
          m("i.quote.right.icon")
        ])
      ] : [
        m("div.content[style=color:#C0C0C0;]", [
          m("i.quote.left.icon"),
          string,
          m("i.quote.right.icon")
        ])
      ]
    }

    if (user === 'undefined' || message === 'undefined') {
      return [m("div.center.aligned.header", "No messages to display.")]

    }
    else {
      return [
        m('a', {href: '/profile/' + user._id(), config: m.route}, [
          m("div.ui.center.aligned.header", user.firstName() + " " + user.lastName() + "")
        ]),
        m("div.ui.padded.grid", [
          m("div.row", [
            m("div.three.wide.column", [
              m("div.content", [
                m('a', {href: '/profile/' + user._id(), config: m.route}, [
                  m("div.ui.tiny.bordered.image", [
                    m('img.ui.tiny.image', { src: User.getPicture(user) })
                  ])
                ])
              ])
            ]),
            m("div.thirteen.wide.column", [
              m("div.field[style=height:50px;]", [
                m("div.center.aligned.ui", [
                  truncate(message, 90)
                ])
              ])
            ])
          ])
        ])

      ]
    }
  };

  return conversationPreview;
};

module.exports = ConversationPreview;