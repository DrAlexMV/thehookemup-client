var auth = {};

auth.User = function () {
	this.isAuthenticated =  m.prop(false);
};


auth.vm = {
	init: function () {
		/* Child Components */
		this.loginForm =  new auth.LoginForm();
		this.socialSignInForm = new auth.SocialSignInForm();
		this.registrationForm = new auth.RegistrationForm();

		/* VM State Variables */
		this.awaitingResponse = m.prop(false);
		this.userRegistering = m.prop(false);

		/* Message Passing Stream */
		this.stream = Bacon.mergeAll(this.loginForm.stream, this.socialSignInForm.stream);

		StreamCommon.on(this.stream, 'signIn-user', function () {
			auth.vm.awaitingResponse(true);
		});

		StreamCommon.on(this.stream, 'register-user', function () {
			auth.vm.userRegistering(true);
		});
	}
};

auth.controller = function () {
	auth.vm.init();
};

auth.view = function () {
	var vm = auth.vm;

	var signInForms = function () {
		return [
			m('div.ui.two.column.grid', [
				m('div.column', [
					vm.socialSignInForm.view({})
				]),
				m('div.column', [
					vm.loginForm.view({})
				])
			])
		]
	};

	return [
		m('div.ui.three.column.stackable.page.grid', [
			m('div.three.wide.column'),
			m('div.ten.wide.column', { style: { 'padding-top': '200px'} }, [
				m('div.ui.piled.segment#auth-segment', [
					m('div', [
						vm.awaitingResponse() ? m('div.ui.active.inverted.dimmer', [m('div.ui.text.loader', 'Loading')]) : null,
					]),
					m('h1.ui.center.aligned.header', [
						m('img', { src: 'img/logo.png' } )
					]),
					m('div.ui.clearing.divider'),
					vm.userRegistering() ? vm.registrationForm.view() : signInForms()
				])
			]),
			m('div.three.wide.column')
		]
	)];
};
