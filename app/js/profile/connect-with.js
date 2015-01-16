
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var UtilsGeneral = require('common/utils-general');

var ConnectWith = function (basicUserInfo) {
  var connectWith = {};

  connectWith.stream = new Bacon.Bus();

  function connect(whichButton) {
    console.log(vm.message());
    connectWith.stream.push(new StreamCommon.Message('ConnectWithModal::'+whichButton, {}));
  }

  var vm = connectWith.vm = {
    profilePicture: new EditableImage(false),
    message: m.prop()
  };

  connectWith.controller = function(basicUserInfo) {

  };

	connectWith.view = function () {
		return [
			m("i.close.icon"),
      m("div.header","Do you wish to connect to " + basicUserInfo().firstName() + " " + basicUserInfo().lastName() + "?"),
      m("div.ui.padded.grid",[
       m("div.six.wide.column",[
        m("div.content",[
          m("div.ui.medium.bordered.image",[
            connectWith.vm.profilePicture.view({userImageURL: basicUserInfo().picture()})
          ])
          ])
         ]),
         m("div.ten.wide.column",[
          m("div.description",[
            m("div.ui.header","Expand your network!"),
            m("p","Choosing to connect will send a notification to this person. After you are connected, you will have full access to this person's contact information, including email and phone number.")
           // m("p","After you are connected, you will have full access to this person's contact information, including email and phone number.")
          ]),


        m("div.content",[
          m("form.ui.form",[
            m("div.field",[
              m("br"),
              m("textarea[placeholder=Please enter a message to "+basicUserInfo().firstName()+" about why you want to connect.]",{onchange: m.withAttr('value', vm.message)})
            ])
          ])
        ])
      ]),
      m("div.actions",[
        m("div.ui.black.button",{onclick: connect.curry("NoConnect")}, "No"),
        m("div.ui.positive.right.labeled.icon.button",{onclick: connect.curry("Connect")},"Yes",[
          m("i.checkmark.icon")
        ])
      ])
    ])
      ];
	};

  return connectWith;
};

module.exports = ConnectWith;