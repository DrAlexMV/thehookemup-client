var FormBuilder = require('common/form-builder');
var StreamCommon = require('common/stream-common');

var RegistrationForm = function () {
	var registrationForm = {};

	var vm =
	registrationForm.vm = {
		firstName: m.prop(''),
		lastName: m.prop(''),
		email: m.prop(''),
		password: m.prop(''),
		roles: m.prop([]),
		errorMessages: m.prop([])
	};

	registrationForm.stream = new Bacon.Bus();

	function back() {
		vm.errorMessages([]);
		registrationForm.stream.push(new StreamCommon.Message('RegistrationForm::Back'));
	}

	function register() {
		vm.errorMessages([]);
		registrationForm.stream.push(new StreamCommon.Message('RegistrationForm::Register', {
			firstName: vm.firstName(),
			lastName: vm.lastName(),
			email: vm.email(),
			password: vm.password(),
			roles: vm.roles()
		}));
	}

	function formInvalid(e) {
		vm.errorMessages(e);
	}

	var rules = {
		password: {
			identifier: 'password',
			rules: [
				{ type: 'empty', prompt: 'Please enter a password' },
				{ type: 'length[8]', prompt: 'Your password must be at least 8 characters' }
			]
		},
		'first-name': {
			identifier: 'first-name',
			rules: [
				{ type: 'empty', prompt: 'Please enter your first name' }
			]
		},
		'last-name': {
			identifier: 'last-name',
			rules: [
				{ type: 'empty', prompt: 'Please enter your last name' }
			]
		},
		'email': {
			identifier: 'email',
			rules: [
				{ type: 'empty', prompt: 'Please enter your email' },
				{ type: 'email', prompt: 'Please enter a valid email' }
			]
		}
	};

	registrationForm.view = function () {

		var nameFields = [
			{ name: 'First Name',
				parameters: { name: 'first-name', placeholder: 'First Name', onchange: m.withAttr('value', vm.firstName) } },
			{ name: 'Last Name',
				parameters: { name: 'last-name', placeholder: 'Last Name', onchange: m.withAttr('value', vm.lastName) } }
		];

		var emailPasswordFields = [
			{ name: 'Email',
				parameters: { name: 'email', placeholder: 'Email', onchange: m.withAttr('value', vm.email) } },
			{ name: 'Password',
				parameters: { name: 'password', placeholder: 'Password', onchange: m.withAttr('value', vm.password), type: 'password' } }
		];

		var roles = ['Founder', 'Investor', 'Startuper'];

		return [
			m('form.ui.form', { class: vm.errorMessages().length > 0 ? 'warning' : '',
													config: FormBuilder.validate(rules, register, formInvalid), action: '' }, [
				m('div.ui.warning.message', [
					m('div.header', 'Oops!'),
					m('ul', [vm.errorMessages().map(function (message) { return m('li', message); })])
				]),
				m('div.two.fields', [
					nameFields.map(function (field) { return FormBuilder.inputs.formField(field.name, field.parameters, field.width); })
				]),
				emailPasswordFields.map(function (field) { return FormBuilder.inputs.formField(field.name, field.parameters) }),
				m('div.inline.fields', [ roles.map(function (role) { return FormBuilder.inputs.checkbox(role, {}, role); }) ]),
				m('div.ui.negative.button', { onclick: back }, 'Back'),
				m('div.ui.right.floated.buttons', [
					m('div.ui.positive.submit.button', 'Register')
				])
			])
		]
	};

	return registrationForm;
};

module.exports = RegistrationForm;

