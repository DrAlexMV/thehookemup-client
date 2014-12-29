auth.RegistrationForm = function () {
	var registrationForm = {};

	registrationForm.vm = {
		firstName: m.prop(''),
		lastName: m.prop(''),
		email: m.prop(''),
		password: m.prop(''),
		roles: m.prop([]),
		displayWarning: m.prop('false')
	};
	
	registrationForm.view = function () {
		var vm = registrationForm.vm;

		function formField(name, parameters) {
			return [
				m('div.required.field', [
					m('label', name),
					m('input', parameters)
				])
			];
		}

		var fields = [
			{ name: 'First Name', parameters: { placeholder: 'First Name', onchange: m.withAttr('value', vm.firstName) } },
			{ name: 'Last Name', parameters: { placeholder: 'Last Name', onchange: m.withAttr('value', vm.lastName) } },
			{ name: 'Email', parameters: { placeholder: 'Email', onchange: m.withAttr('value', vm.email) } },
			{ name: 'Password', parameters: { placeholder: 'Password', onchange: m.withAttr('value', vm.password), type: 'password' } }
		];

		return [
			m('form.ui.form', { classname: vm.displayWarning() ? 'warning' : '' }, [
				m('div.ui.warning', [
					m('div.ui.warning.message', [
						m('div.header', 'Oops!'),
						m('ul.list', [])
					])
				]),
				m('div', [
					fields.map(function (field) { return formField(field.name, field.parameters); })
				])
			])
		]
	};

	return registrationForm;
};