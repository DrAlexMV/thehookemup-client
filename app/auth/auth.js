var auth = {};

auth.User = function () {
	this.isAuthenticated =  m.prop(false)
}


auth.vm = {
	init: function () {
		this.loginForm =  new auth.LoginForm();
		this.socialSignInForm = new auth.SocialSignInForm();

		this.awaitingResponse = m.prop(false);
		this.stream = Bacon.mergeAll(this.loginForm.stream, this.socialSignInForm.stream);

		this.loginForm.stream
			.filter(function (event) { return event.name === 'signIn-user'; })
			.subscribe(function (event) {

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

	return [
		m('div.ui.three.column.stackable.page.grid', [
			m('div.three.wide.column'),
			m('div.ten.wide.column', { style: { 'padding-top': '200px'} }, [
				m('div.ui.two.column.piled.segment.grid#auth-segment', [
					vm.awaitingResponse() ? m('div.ui.active.inverted.dimmer', [m('div.ui.text.loader', 'Loading')]) : null,
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
		]
	)];
};
