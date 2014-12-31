var Navbar = require('navigation/navbar');

var layout = {};

layout.vm = {
	init: function () {
		this.navbar = new Navbar();
	}
};

layout.controller = function () {
	layout.vm.init();
};

layout.view = function () {
	return [
		layout.vm.navbar.view()
	]
};

module.exports = layout;
