var Config = require('config');
var StreamCommon = require('common/stream-common');
	
var SocialSignInForm = function () {
	var socialSignInForm = {};

	socialSignInForm.vm = {

	};

	socialSignInForm.stream = new Bacon.Bus();

	function signIn(socialType, token) {
		socialSignInForm.stream.push(
			new StreamCommon.Message('SocialSignInForm::SignIn',
				{ socialType: socialType, token: token }
			)
		);
	}

	var facebookLogin = function() {
        FB.init({
            appId      : Config['FACEBOOK_APP_ID'],
            xfbml      : true,
            version    : 'v2.1'
        });

		FB.login(function(response) {
			if (response.authResponse) {
				signIn('facebook', response.authResponse.accessToken);
			}
		});
	};

	socialSignInForm.view = function () {
		return [
			m('form.socialSignInForm.ui.form', [
				m('div.ui.one.column.grid', [
					m('div.column', [
						m('div.grouped.fields', [
							m('div.ui.facebook.button', {
									onclick: facebookLogin
								},[
									m('i.facebook.icon'),
									'Sign In with Facebook'
								]
							)
						])
					])
				])
			])
		]
	};

	return socialSignInForm;
};

module.exports = SocialSignInForm;
