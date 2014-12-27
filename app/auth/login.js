auth.LoginForm = function () {
	var loginForm = {};

	loginForm.vm = {
		email: m.prop(''),
		password: m.prop('')
	};

	loginForm.view = function () {
		return [
			m('form.ui.form', [
				m('div.two.fields', [
					m('div.required.field', [
						m('div.ui.icon.input', [
							m('input', { placeholder: 'Email', type: 'text' }),
							m('i.user.icon')
						])
					]),
					m('div.required.field', [
						m('div.ui.icon.input', [
							m('input', { placeholder: 'Password', type: 'password' }),
							m('i.lock.icon')
						])
					])
				])
			])
		];
	};

	return loginForm;
};
