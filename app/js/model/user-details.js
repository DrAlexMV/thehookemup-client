var Details = function(API) {
	var details = {};

	details.DetailModel = function(data) {
		this.title = m.prop(data.title);
		this.content = m.prop(data.content); // We can further modularize if need be
	};

	details.getByID = function(userID) {
		return API.get('/user/' + userID + '/details', details.DetailModel);
	};

	return _.mixin(details, API);
};

module.exports = Details;
