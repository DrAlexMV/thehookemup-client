/**
 * Created by austinstone on 1/23/15.
 */


var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');


var MessageDisplay = function (message, user) {

  var messageDisplay = {};

  messageDisplay.stream = new Bacon.Bus();

  messageDisplay.view = function () {

    return [
      m('a', {href: '/profile/' + user._id(), config: m.route}, [
        m("div.ui.center.aligned.header", user.firstName() + " " + user.lastName() + "")
      ]),
      m("div.ui.meta[style=color:Gainsboro;]", "12/25/2014"),
      m("div.ui.padded.grid", [
        m("div.row", [
          m("div.three.wide.column", [
            m("div.content", [
              m('a', {href: '/profile/' + user._id(), config: m.route}, [
                m("div.ui.mini.bordered.image", [
                  m('img.ui.mini.image', { src: user.getPicture() })
                ])
              ])
            ])
          ]),
          m("div.thirteen.wide.column", [
            m("div.field", [
              m("div.center.aligned.ui", [
               message
              ])
            ])
          ])
        ])
      ])

    ]
  };

  return messageDisplay;
};

module.exports = MessageDisplay;
