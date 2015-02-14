var LoginForm = require('auth/login-form');
var RegistrationForm = require('auth/registration-form');
var SocialSignInForm = require('auth/social-signIn-form');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var Context = require('common/context');

var auth = {};

auth.vm = {
	init: function () {
		var urlInvite = m.route.param('invite');

		/* Child Components */
		this.loginForm =  new LoginForm();
		this.socialSignInForm = new SocialSignInForm();
		this.registrationForm = new RegistrationForm(urlInvite);

		/* VM State Variables */
		this.awaitingResponse = m.prop(false);
		this.userRegistering = m.prop(urlInvite);

		/* Message Passing Stream */
		auth.stream = Bacon.mergeAll(this.loginForm.stream, this.socialSignInForm.stream, this.registrationForm.stream);

		StreamCommon.on(auth.stream, 'LoginForm::SignIn', function (message) {
			auth.vm.awaitingResponse(true);

			var loginForm = auth.vm.loginForm;

			User.login(message.parameters)
				.then(function (res) {
					m.route('/');
					Context.setCurrentUser(res);
				}, function (res) {
					loginForm.vm.errorMessages([res.error]);
				}).then(function () { auth.vm.awaitingResponse(false); });
		}, true);

		StreamCommon.on(auth.stream, 'SocialSignInForm::SignIn', function (message) {
			auth.vm.awaitingResponse(true);

			var loginForm = auth.vm.loginForm;

			User.socialSignIn(message.parameters)
				.then(function (res) {
					m.route('/');
					Context.setCurrentUser(res);
				}, function (res) {
					loginForm.vm.errorMessages([res.error]);
				}).then(function () { auth.vm.awaitingResponse(false); });
		}, true);

		StreamCommon.on(auth.stream, ['LoginForm::Register', 'RegistrationForm::Back'], function (message) {
			auth.vm.userRegistering(message.name === 'LoginForm::Register');
		});

		StreamCommon.on(auth.stream, 'RegistrationForm::Register', function (message) {
			auth.vm.awaitingResponse(true);

			var regForm = auth.vm.registrationForm;

			User.register(message.parameters).then(function (res) {
				Context.setCurrentUser(res);
				m.route('/profile-wizard');
			}, function (res) {
				regForm.vm.errorMessages([res.error]);
			}).then(function () { auth.vm.awaitingResponse(false); });
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
			m('div.ui.two.column.stackable.grid', [
				m('div.column', [
					vm.socialSignInForm.view()
				]),
				m('div.column', [
					vm.loginForm.view()
				])
			])
		]
	};

	return [
		m('div.ui.three.column.stackable.page.grid', [
			m('div.three.wide.column'),
			m('div.ten.wide.column', { style: { 'margin-top': '100px'} }, [
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

module.exports = auth;
