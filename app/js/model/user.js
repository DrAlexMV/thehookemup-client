var API = require('common/api');

var User = function(API) {
	var users = {};

	users.UserModel = function(data) {
		this.first_name = m.prop(data.first_name);
		this.last_name = m.prop(data.last_name);
		this.email = m.prop(data.email);
		this.date_joined = m.prop(data.date_joined);
		this.graduation_year = m.prop(data.graduation_year);
		this.major = m.prop(data.major);
		this.description = m.prop(data.description);
		this.university = m.prop(data.university);
	};

	users.getByID = function(userID) {
		return API.get('/user/' + userID, users.UserModel);
	};

	users.getLogin = function() {
		//return API.('/login', users.UserModel);
	};

	_.mixin(users, API);
	return users;
};

module.exports = User(API);
