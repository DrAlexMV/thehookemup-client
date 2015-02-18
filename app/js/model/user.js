var API = require('common/api');
var ImageModel = require('model/image');


var User = function(API) {
	var user = {};

	user.UserModel = function (data) {
		this._id = m.prop(data._id);
		this.firstName = m.prop(data.firstName);
		this.lastName = m.prop(data.lastName);
		this.email = m.prop(data.email);
		this.dateJoined = m.prop(data.dateJoined);
		this.graduationYear = m.prop(data.graduationYear);
		this.major = m.prop(data.major);
		this.description = m.prop(data.description);
		this.university = m.prop(data.university);
		this.roles = m.prop(data.roles);
		this.picture = m.prop(data.picture);
		this.connectionType = m.prop(data.connectionType);
		this.endorsementCount = m.prop(data.endorsementCount);
        this.handles = m.prop(data.handles);

		this.getName = function () {
			return this.firstName() + ' ' + this.lastName();
		};

		this.getPicture = function () {
			return ImageModel.getSource(this.picture());
		};

		this.getPath = function () {
			return '/users'
		};

		return this;
	};

	user.getByID = function (userID) {
		return this.get('/users/' + userID, user.UserModel);
	};

	user.getMe = function () {
		return user.getByID('me');
	};

	user.putByID = function (userID, updatedProperties) {
		return this.put('/users/' + userID, updatedProperties);
	};

	user.login = function (credentials) {
		return this.post('/login', credentials, user.UserModel);
	};

    user.logout = function() {
        return this.get('/logout', null);
    };

	user.socialSignIn = function(credentials) {
		return this.post('/login-social', credentials, user.UserModel);
	};

	user.register = function (newUser) {
		return this.post('/signup', newUser, user.UserModel);
	};

	user.updatePicture = function (userid, picture) {
		user.putByID(userid, {picture: picture});
	};

	_.mixin(user, API);
	return user;
};

module.exports = User(API);
