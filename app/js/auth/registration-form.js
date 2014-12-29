var FormBuilder = require('common/form-builder');
var StreamCommon = require('common/stream-common');

var RegistrationForm = function () {
	var registrationForm = {};

	registrationForm.vm = {
		firstName: m.prop(''),
		lastName: m.prop(''),
		email: m.prop(''),
		password: m.prop(''),
		roles: m.prop([]),
		displayWarning: m.prop(false)
	};

	registrationForm.stream = new Bacon.Bus();

	function register() {
		registrationForm.stream.push(new StreamCommon.Message('RegistrationForm::Register'));
	}

	function back() {
		registrationForm.stream.push(new StreamCommon.Message('RegistrationForm::Back'));
	}
	
	registrationForm.view = function () {
		var vm = registrationForm.vm;

		function validate(element, isInitialized) {
			$(element).form({

			});
		}

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

		return [
			m('form.ui.form', { class: vm.displayWarning() ? 'warning' : '', config: validate }, [
				m('div.ui.warning', [
					m('div.ui.warning.message', [
						m('div.header', 'Oops!'),
						m('ul.list', [])
					])
				]),
				m('div.two.fields', [
					nameFields.map(function (field) { return FormBuilder.inputs.formField(field.name, field.parameters, field.width); })
				]),
				emailPasswordFields.map(function (field) { return FormBuilder.inputs.formField(field.name, field.parameters) }),
				m('div.ui.negative.button', { onclick: back }, 'Back'),
				m('div.ui.right.floated.buttons', [
					m('div.ui.positive.button', { onclick: register }, 'Register')
				])
			])
		]
	};

	return registrationForm;
};

module.exports = RegistrationForm;

