auth.login = {};

auth.login.vm = (function() {
	var vm = {};
	vm.init = function() {
		vm.email = m.prop('');
		vm.password = m.prop('')

		//adds a todo to the list, and clears the description field for user convenience
		vm.loginUser = function() {
			if (vm.email() && vm.password()) {
			}
		};
	};
	return vm
}());

//the controller defines what part of the model is relevant for the current page
//in our case, there's only one view-model that handles everything
auth.login.controller = function() {
	auth.vm.init();
};

//here's the view
auth.login.view = function() {
	return m("form", [
	]);
};

//initialize the application
m.module(document.getElementById('auth-segment'), { controller: auth.login.controller, view: auth.login.view });
