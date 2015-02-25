/**
 * @jsx m
 */

var Config = require('config');
var User = require('model/user');

var AttachSocialSegment = function () {

	var attachSocialSegment = {};

	function attachFacebook() {
		// TODO: Avoid code duplication here
		FB.init({
			appId: Config['FACEBOOK_APP_ID'],
			xfbml: true,
			version: 'v2.1'
		});

		FB.login(function (response) {
			if (response.authResponse) {
				User.attachSocialSignIn('facebook', response.authResponse.userID)
					.then(function (response) {
						if (response.error === null) {
							console.log('Facebook Attached');
						} else {
							console.log('Error in Attaching Facebook');
						}
					});
			}
		});
	}

	attachSocialSegment.view = function () {
		return (
			<div className="ui segment">
				<div className="ui ribbon label theme-color-main">Social Signins</div>
				<h5>Enable Logging In Using These Services</h5>
				<div className="ui hidden divider"></div>
				<div className="ui facebook button" onclick={ attachFacebook }>
					<i className="facebook icon"></i>
				Link To Facebook
				</div>
			</div>
			);
	}

	return attachSocialSegment;
};

module.exports = AttachSocialSegment;
