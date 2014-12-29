var StreamCommon = require('common/stream-common');

var LoginForm = function () {
	var loginForm = {};

	var vm =
	loginForm.vm = {
		email: m.prop(''),
		password: m.prop('')
	};

	loginForm.stream = new Bacon.Bus();

	function register(event) {
		loginForm.stream.push(new StreamCommon.Message('LoginForm::Register', {}));
	}

	function signIn(event) {
		loginForm.stream.push(new StreamCommon.Message('LoginForm::SignIn', { email: vm.email(), password: vm.password() }));
	}

	loginForm.view = function () {
		return [
			m('form.ui.form', [
				m('div.required.field', [
					m('div.ui.icon.input', [
						m('input', { placeholder: 'Email', type: 'text', onchange: m.withAttr('value', vm.email) }),
						m('i.user.icon')
					])
				]),
				m('div.required.field', [
					m('div.ui.icon.input', [
						m('input', { placeholder: 'Password', type: 'password', onchange: m.withAttr('value', vm.password) }),
						m('i.lock.icon')
					])
				]),
				m('div.ui.right.floated.buttons', [
					m('div.ui.button.primary', { onclick: register }, 'Register'),
					m('.or'),
					m('div.ui.button.positive', { onclick: signIn } , 'Sign In')
				])
			])
		];
	};

	return loginForm;
};

module.exports = LoginForm;
