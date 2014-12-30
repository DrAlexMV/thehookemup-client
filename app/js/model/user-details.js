var API = require('common/api');

var Details = function(API) {
	var details = {};

	details.DetailModel = function(data) {
		this.title = m.prop(data.title);
		this.content = m.prop(data.content); // We can further modularize if need be
	};

	details.getByID = function(userID) {
		return this.get('/user/' + userID + '/details', details.DetailModel);
	};

	_.mixin(details, API);
	return details;
};

module.exports = Details(API);
