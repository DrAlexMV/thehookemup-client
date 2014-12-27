var auth = {};

auth.vm = {
	init: function () {
		this.loginForm =  new auth.LoginForm();

		this.login = function () {
//			m.request();
		};
	}
};

auth.controller = function () {
	auth.vm.init();
};

auth.view = function () {
	var vm = auth.vm;

	return m('div.ui.page.grid', [
		m('div.sixteen.wide.column', [
			m('h1.ui.header', "The Hook'Em Up"),
			m('div.ui.piled.segment#auth-segment', [
				vm.loginForm.view({  })
			])
		])
	]);
};
