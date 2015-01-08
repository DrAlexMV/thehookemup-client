
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');

var ConnectWith = function (basicUserInfo) {
  var connectWith = {};

  connectWith.stream = new Bacon.Bus();

  function connect(message) {
    connectWith.stream.push(new StreamCommon.Message('ConnectWithModal::Connect', {}));
  }

  function noConnect(message) {
    connectWith.stream.push(new StreamCommon.Message('ConnectWithModal::NoConnect', {}));
  }



  var vm = connectWith.vm = {
    profilePicture: new EditableImage(false)
  };

  connectWith.controller = function(basicUserInfo) {

  };





	connectWith.view = function () {
		return [
			m("i.close.icon"),
      m("div.header","Do you wish to connect to " + basicUserInfo().firstName() + " " + basicUserInfo().lastName() + "?"),
      m("div.content",[
        m("div.ui.medium.bordered.image",[
          connectWith.vm.profilePicture.view({userImageURL: basicUserInfo().picture()})
        ]),
        m("div.description",[
          m("div.ui.header","Expand your network!"),
          m("p","Choosing to connect will send a notification to this person."),
          m("p","After you are connected, you will have full access to this person's contact information, including email and phone number.")
        ])
      ]),
      m("div.actions",[
        m("div.ui.black.button",{onclick: noConnect}, "No"),
        m("div.ui.positive.right.labeled.icon.button",{onclick: connect},"Yes",[
          m("i.checkmark.icon")
        ])
      ])
    ];
	};

  return connectWith;
};

module.exports = ConnectWith;