var Config = require('config');
var StreamCommon = require('common/stream-common');

var SocialSignInForm = function () {
	var socialSignInForm = {};

	var vm = {};

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

	var linkedinLogin = function() {
		IN.User.authorize(function() {
			if (IN.User.isAuthorized()) {
				IN.API.Profile('me').result(function(res) {
					var userProfile = res.values[0];
					//userProfile.id
					console.log(userProfile, 'FOO');
					console.log(document.cookie);
				});
			}
		}, this);

		//IN.API.Profile("me").fields(["positions"]).result(f)
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
							),
							m('div.ui.linkedin.button', {
									onclick: linkedinLogin
								},[
									m('i.linkedin.icon'),
									'Sign In with LinkedIn'
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
