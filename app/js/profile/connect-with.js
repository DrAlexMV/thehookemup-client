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
			m("div", "U WANNA CONNECT NIGGA?")
		];
	};

  return connectWith;
};

module.exports = ConnectWith;