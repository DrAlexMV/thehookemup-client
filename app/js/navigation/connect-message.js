/**
 * Created by austinstone on 1/18/15.
 */


var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');

var ConnectMessage = function (basicUserInfo, message) {
  var connectMessage = {};

  connectMessage.stream = new Bacon.Bus();

  function connect(whichButton) {
    connectMessage.stream.push(new StreamCommon.Message('ConnectMessageModal::'+whichButton, {}));
  }

  var vm = connectMessage.vm = {
    profilePicture: new EditableImage(false),
    message: message
  };

  connectMessage.controller = function(basicUserInfo) {

  };

  connectMessage.view = function () {
    return [
      m("i.close.icon"),
      m("div.header","Message from " + basicUserInfo().firstName() + " " + basicUserInfo().lastName() + ":"),
      m("div.ui.padded.grid",[
        m("div.six.wide.column",[
          m("div.content",[
            m("div.ui.medium.bordered.image",[
              connectMessage.vm.profilePicture.view({userImageURL: basicUserInfo().picture()})
            ])
          ])
        ]),
        m("div.ten.wide.column",[
          m("div.content",[
            m("div.field",[
              m("br"),
              m("div.ui.segment",[
                m("i.quote.left.icon"),
                m("content",vm.message),
                m("i.quote.right.icon")
              ])
            ])
          ]),
          m('br'),
          m("div.description",[
            m("div.ui.header","Expand your network!"),
            m("p","Choosing to connect will give "+ basicUserInfo().firstName() +
              " access to your email address and phone number. You will also have full access to " +
              basicUserInfo().firstName() + "'s contact information, including email and phone number.")
            // m("p","After you are connected, you will have full access to this person's contact information, including email and phone number.")
          ])
        ]),
        m("div.actions",[
          m("div.ui.black.button",{onclick: connect.bind(connect,"NoConnect")}, "Not Now"),
          m("div.ui.positive.right.labeled.icon.button",{onclick: connect.bind(connect,"Connect")},"Connect",[
            m("i.checkmark.icon")
          ])
        ])
      ])
    ];
  };

  return connectMessage;
};

module.exports = ConnectMessage;