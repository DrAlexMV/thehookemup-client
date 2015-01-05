var API = require('common/api');
var ImageModel = require('model/image');

var User = function(API) {
	var user = {};

	user.UserModel = function(data) {
		this._id = m.prop(data._id);
		this.firstName = m.prop(data.firstName);
		this.lastName = m.prop(data.lastName);
		this.email = m.prop(data.email);
		this.dateJoined = m.prop(data.dateJoined);
		this.graduationYear = m.prop(data.graduationYear);
		this.major = m.prop(data.major);
		this.description = m.prop(data.description);
		this.university = m.prop(data.university);
		this.role = m.prop(data.role);
		this.picture = m.prop(data.picture);
		this.isConnection = m.prop(data.isConnection);
		return this;
	};

	user.getByID = function (userID) {
		return this.get('/user/' + userID, user.UserModel);
	};

	user.getMe = function () {
		return this.get('/user/me', user.UserModel);
	};

	user.putByID = function (userID, updatedProperties) {
		return this.put('/user/' + userID, updatedProperties);
	};

	user.login = function (credentials) {
		return this.post('/login', credentials);
	};

	user.register = function (newUser) {
		return this.post('/signup', newUser);
	};

	user.updatePicture = function (userid, picture) {
		user.putByID(userid, {picture: picture});
	};

	user.getPicture = function(userInstance) {
		return ImageModel.getSource(userInstance.picture());
	};

	user.getName = function(userInstance) {
		return userInstance.firstName() + ' ' + userInstance.lastName();
	};

	user.connectMe = function(otherUserID) {
		return this.post('/user/me/edges/connections', {user: otherUserID});
	};

	_.mixin(user, API);
	return user;
};

module.exports = User(API);
