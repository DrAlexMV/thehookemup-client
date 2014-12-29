var SocialSignInForm = function () {
	var socialSignInForm = {};

	socialSignInForm.vm = {

	};

	socialSignInForm.stream = new Bacon.Bus();

	socialSignInForm.view = function () {
		return [
			m('form.socialSignInForm.ui.form', [
				m('div.ui.one.column.grid', [
					m('div.column', [
						m('div.grouped.fields', [
							m('div.ui.facebook.button', [
								m('i.facebook.icon'),
								'Sign up with Facebook'
							])
						]),
						m('div.grouped.fields', [
							m('div.ui.twitter.button', [
								m('i.twitter.icon'),
								'Sign up with Twitter'
							])
						]),
						m('div.grouped.fields', [
							m('div.ui.google.plus.button', [
								m('i.google.plus.icon'),
								'Sign up with Google Plus'
							])
						])
					])
				])
			])
		]
	};

	return socialSignInForm;
};

module.exports = SocialSignInForm;
