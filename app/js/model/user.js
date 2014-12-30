var User = function(API) {
	var users = {};
	
	users.UserModel = function(data) {
		this.name = m.prop(data.name);
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
		return API.get('/login', users.UserModel);
	};

	return _.mixin(users, API);
};

module.exports = User;
