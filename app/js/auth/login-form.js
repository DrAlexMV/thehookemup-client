var StreamCommon = require('common/stream-common');
var FormBuilder = require('common/form-builder');

var LoginForm = function () {
	var loginForm = {};

	var vm =
	loginForm.vm = {
		email: m.prop(''),
		password: m.prop(''),
		errorMessages: m.prop([])
	};

	loginForm.stream = new Bacon.Bus();

	function register(event) {
		loginForm.stream.push(new StreamCommon.Message('LoginForm::Register', {}));
	}

	function signIn(event) {
		loginForm.stream.push(new StreamCommon.Message('LoginForm::SignIn', { email: vm.email(), password: vm.password() }));
	}

	var validationRules = {
		email: {
			identifier: 'email',
			rules: [
				{ type: 'empty', prompt: 'Please your email' },
				{ type: 'email', prompt: 'Please enter a valid email' }
			]
		},
		password: {
			identifier: 'password',
			rules: [
				{ type: 'empty', prompt: 'Please enter a password' }
			]
		}
	};


	loginForm.view = function () {
		return [
			m('form.ui.form', { class: vm.errorMessages().length > 0 ? 'warning' : '',
													config: FormBuilder.validate(validationRules, signIn, function () {}) } , [
				m('div.ui.warning.message', [
					m('div.header', 'Oops!'),
					m('ul', [
						vm.errorMessages().map(function (message) { return m('li', message); })
					])
				]),
				m('div.required.field', [
					m('div.ui.icon.input', [
						m('input', { name: 'email', placeholder: 'Email', type: 'text', onchange: m.withAttr('value', vm.email) }),
						m('i.user.icon')
					])
				]),
				m('div.required.field', [
					m('div.ui.icon.input', [
						m('input', { name: 'password', placeholder: 'Password',
												 type: 'password', onchange: m.withAttr('value', vm.password) }),
						m('i.lock.icon')
					])
				]),
				m('div#login-buttons.ui.fluid.buttons', [
					m('div.ui.button.primary', { onclick: register }, 'Register'),
					m('.or'),
					m('div.ui.submit.button.positive', 'Sign In')
				])
			])
		];
	};

	return loginForm;
};

module.exports = LoginForm;
