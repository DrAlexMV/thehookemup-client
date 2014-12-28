var auth = {};

auth.vm = {
	init: function () {
		this.loginForm =  new auth.LoginForm();
		this.socialSignInForm = new auth.SocialSignInForm();

		this.stream = Bacon.mergeAll(this.loginForm.stream, this.socialSignInForm.stream);

		this.loginForm.stream.subscribe(function (event) {
			console.log(event);
		});
		
		this.socialSignInForm.stream.subscribe(function () {
			
		});
	}
};

auth.controller = function () {
	auth.vm.init();
};

auth.view = function () {
	var vm = auth.vm;

	return m('div.ui.three.column.stackable.page.grid', [
		m('div.three.wide.column'),
		m('div.ten.wide.column', { style: { 'padding-top': '200px'} }, [
			m('div.ui.two.column.piled.segment.grid#auth-segment', [
				m('div.row', [
					m('h1.ui.center.aligned.header', [
						m('img', { src: 'img/logo.png' } )
					])
				]),
				m('div.ui.clearing.divider'),
				m('div.column', [
					vm.socialSignInForm.view({})
				]),
				m('div.column', [
					vm.loginForm.view({})
				])
			])
		]),
		m('div.three.wide.column')
	]);
};
