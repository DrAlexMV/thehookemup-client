var FormBuilder = require('common/form-builder');
var StreamCommon = require('common/stream-common');
var MultiCheckbox = require('common/ui-core/multi-checkbox');

var RegistrationForm = function () {
	var registrationForm = {};

	var vm =
	registrationForm.vm = {
		firstName: m.prop(''),
		lastName: m.prop(''),
		email: m.prop(''),
		password: m.prop(''),
		roles: m.prop([]),
		confirmPassword: m.prop(''),
		errorMessages: m.prop([]),
		availableRoles: m.prop(['Founder', 'Investor', 'Startupper']),
		rolesCheckbox: MultiCheckbox()
	};

	registrationForm.stream = new Bacon.Bus();
	registrationForm.stream.plug(vm.rolesCheckbox.stream);

	StreamCommon.on(registrationForm.stream, 'Change::MultiCheckbox', function (message) {
		vm.roles(message.parameters.choices);
	});

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
		confirm: {
			identifier: 'confirm-password',
			rules: [
				{ type: 'empty', prompt: 'Please confirm your password' },
				{ type: 'match[password]', prompt: 'Your passwords do not match' }
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
			{ parameters: { name: 'first-name', placeholder: 'First Name', onchange: m.withAttr('value', vm.firstName) } },
			{ parameters: { name: 'last-name', placeholder: 'Last Name', onchange: m.withAttr('value', vm.lastName) } }
		];

		var emailPasswordFields = [
			{ parameters: { name: 'email', placeholder: 'Email', onchange: m.withAttr('value', vm.email) } },
			{ parameters: { name: 'password', placeholder: 'Password', onchange: m.withAttr('value', vm.password), type: 'password' } },
			{ parameters: { name: 'confirm-password', placeholder: 'Confirm Password', onchange: m.withAttr('value', vm.confirmPassword), type: 'password' } }
		];

		return [
			m('form.ui.form', { class: vm.errorMessages().length > 0 ? 'warning' : '',
													config: FormBuilder.validate(rules, register, formInvalid) }, [
				m('div.ui.warning.message', [
					m('div.header', 'Oops!'),
					m('ul', [vm.errorMessages().map(function (message) { return m('li', message); })])
				]),
				m('div.two.fields', [
					nameFields.map(function (field) { return FormBuilder.inputs.formField(field.parameters, '', field.width); })
				]),
				emailPasswordFields.map(function (field) { return FormBuilder.inputs.formField(field.parameters) }),
				m('div.grouped.inline.fields', [
					vm.rolesCheckbox.view(vm.availableRoles())
				]),
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

