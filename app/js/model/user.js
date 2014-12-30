var API = require('common/api');

var User = function(API) {
	var user = {};

	user.UserModel = function(data) {
		this.first_name = m.prop(data.first_name);
		this.last_name = m.prop(data.last_name);
		this.email = m.prop(data.email);
		this.date_joined = m.prop(data.date_joined);
		this.graduation_year = m.prop(data.graduation_year);
		this.major = m.prop(data.major);
		this.description = m.prop(data.description);
		this.university = m.prop(data.university);
	};

	user.getByID = function(userID) {
		return this.get('/user/' + userID, user.UserModel);
	};

	user.getMe = function() {
		return this.get('/user/me', user.UserModel);
	};
	
	user.register = function (credentials) {
		return this.post('/signup', credentials);
	};

	_.mixin(user, API);
	return user;
};

module.exports = User(API);
