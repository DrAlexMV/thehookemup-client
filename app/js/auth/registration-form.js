var FormBuilder = require('common/form-builder');
var Invites = require('model/invites');
var StreamCommon = require('common/stream-common');
var MultiCheckbox = require('common/ui-core/multi-checkbox');

var RegistrationForm = function (urlInvite) {
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
		availableRoles: m.prop([
			{
				name: 'Founder',
				description: 'Already started a company or planning to?'
			},
			{
				name: 'Investor',
				description: 'Interested in investing in ventures?'
			}, {
				name: 'Builder',
				description: 'Are you a programmer, designer, researcher, etc.?'
			}
		]),
		rolesCheckbox: MultiCheckbox(),
		showForm: m.prop(false),
		invite: m.prop(urlInvite ? urlInvite : ''),
		invalidInvite: m.prop(false)
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
			roles: vm.roles(),
			invite: vm.invite()
		}));
	}

	function testInvite() {
		Invites.validate(vm.invite()).then(function(response) {
			if (response.status) {
				vm.showForm(true);
			}
		}, function(response) {
			vm.invalidInvite(true);
		});
	}

	function formInvalid(e) {
		vm.errorMessages(e);
	}

	var rules = {
		password: {
			identifier: 'password',
			rules: [
				{ type: 'empty', prompt: 'please enter a password' },
				{ type: 'length[8]', prompt: 'your password must be at least 8 characters' }
			]
		},
		confirm: {
			identifier: 'confirm-password',
			rules: [
				{ type: 'empty', prompt: 'please confirm your password' },
				{ type: 'match[password]', prompt: 'your passwords do not match' }
			]
		},
		'first-name': {
			identifier: 'first-name',
			rules: [
				{ type: 'empty', prompt: 'please enter your first name' }
			]
		},
		'last-name': {
			identifier: 'last-name',
			rules: [
				{ type: 'empty', prompt: 'please enter your last name' }
			]
		},
		'email': {
			identifier: 'email',
			rules: [
				{ type: 'empty', prompt: 'please enter your email' },
				{ type: 'email', prompt: 'please enter a valid email' }
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


		var form = [
			m('form.ui.form', { class: vm.errorMessages().length > 0 ? 'warning' : '',
													config: FormBuilder.validate(rules, register, formInvalid) }, [
				m('div.ui.warning.message', [
					m('div.header', 'Oops!'),
					m('ul', [vm.errorMessages().map(function (message) { return m('li', message); })])
				]),

				m('div.one.field', [
					m('div.ui.icon.input', [m('input', { value: vm.invite(), disabled: true }), m('i.checkmark.green.icon')])
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
		];

		var inviteEntry = [
			vm.invalidInvite() ?
				m('div.ui.warning.message', [
					m('div.header', 'Oops!'),
					m('ul', [m('li', 'Invalid invite code.') ])
				]) : null,
			m('div.ui.action.input' + (vm.invalidInvite() ? '.error' : ''), [
				m('input', {
					placeholder: 'Enter Invite Code',
					onchange: m.withAttr('value', vm.invite),
					value: vm.invite()
				}),
				vm.showForm() ? null : m('div.ui.button', {
					onclick: testInvite
				}, 'Continue')
			])
		];

		return [
			vm.showForm() ? form : inviteEntry
		];
	};

	return registrationForm;
};

module.exports = RegistrationForm;

