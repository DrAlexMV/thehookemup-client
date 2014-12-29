var RegistrationForm = function () {
	var registrationForm = {};

	registrationForm.vm = {
		firstName: m.prop(''),
		lastName: m.prop(''),
		email: m.prop(''),
		password: m.prop(''),
		roles: m.prop([])
	};
	
	registrationForm.view = function () {

		var fields = [
			{ name: 'First Name', parameters: { } }
		];

		function formField(name, parameters) {
			return [
				m('div.field', [
					m('label', name),
					m('input', parameters)
				])
			];
		}

		return [
			m('form.ui.form', [
				m('div.ui.warning.form', [
					m('div.ui.warning.message', [
						m('div.header', 'Oops!'),
						m('ul.list', [

						])
					])
				]),
				m('div.two.fields', [
					m('div.field', [
					]),
					m('div.field', [

					])
				])
			])
		]
	};

	return registrationForm;
};

module.exports = RegistrationForm;

