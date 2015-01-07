var ConnectWith = function () {
  var connectWith = {};

	var vm =
  connectWith.vm = {
    init: function() {

		}
  };

  connectWith.controller = function() {
    vm.init()
  };



	connectWith.view = function () {
		return [
			m("i.close.icon", [
        m("div.header","Do you wish to connect to this person?"),
        m("div.content",[
          m("div.ui.medium.image",[
            m("image[href='img/bevo_icon.jpg'][height='200px'][width='200px']")
          ]),
          m("div.description",[
            m("div.ui.header","Stuff about connecting 1"),
            m("p","Stuff about connecting 2"),
            m("p","Stuff about connecting 3")
          ])
        ]),
        m("div.actions",[
          m("div.ui.black.button", "No"),
          m("div.ui.positive.right.labeled.icon.button","Yes",[
            m("i.checkmark.icon")
          ])
        ])
      ])
    ];
	};

  return connectWith;
};

module.exports = ConnectWith;