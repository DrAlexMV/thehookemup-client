var API = require('common/api');

var User = function(API) {
	var user = {};

	user.UserModel = function(data) {
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
	};

	user.getByID = function (userID) {
		return this.get('/user/' + userID, user.UserModel);
	};

	user.getMe = function () {
		return this.get('/user/me', user.UserModel);
	};

	user.login = function (credentials) {
		return this.post('/login', credentials);
	};

	user.register = function (newUser) {
		return this.post('/signup', newUser);
	};

	_.mixin(user, API);
	return user;
};

module.exports = User(API);
