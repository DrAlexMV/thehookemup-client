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

		return this;
	};

	user.getByID = function (userID) {
		return this.get('/user/' + userID, user.UserModel);
	};

	user.getMe = function () {
		return user.getByID('me');
	};

	user.putByID = function (userID, updatedProperties) {
		return this.put('/user/' + userID, updatedProperties);
	};

	user.login = function (credentials) {
		return this.post('/login', credentials, user.UserModel);
	};

	user.register = function (newUser) {
		return this.post('/signup', newUser, user.UserModel);
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

	_.mixin(user, API);
	return user;
};

module.exports = User(API);
