var API = require('common/api');
var User = require('model/user');

var SearchResults = function(API) {
	var searchResults = {};

	searchResults.possibleFields = [
		'query_string',
		'firstName',
		'lastName',
		'roles',
		'description',
		'email',
		'major',
		'graduationYear',
		'university',
		'details',
		'jobs',
		'skills',
		'followCounts'
	];

	searchResults.ResultsModel = function(data) {
		var results = data.results.map(
			function(result) { 
				return new User.UserModel(result);
			}
		);

		this.results = m.prop(results);
		this.metadata = m.prop(data.metadata);
	};

	searchResults.extractFields = function(mithrilRoute) {
		var params = {};
		searchResults.possibleFields.forEach(function(fieldName) {
			var paramValue = mithrilRoute.param(fieldName);
			if (paramValue) {
				params[fieldName] = paramValue;
			}
		});

		return params;
	};

	searchResults.getResults = function(params) {
		var stringified = jQuery.param(params); // another library for this?
		return this.get('/search?' + stringified, searchResults.ResultsModel);
	};

	searchResults.buildURL = function(params) {
		var stringified = jQuery.param(params);
		return '/search?' + stringified;
	};

	// Fill in missing fields with values of ''
	searchResults.normalizeFields = function(fields) {
		var resultingFields = {};
		searchResults.possibleFields.forEach(function(fieldName) {
			resultingFields[fieldName] = fields[fieldName] ? fields[fieldName] : '';
		});
		return resultingFields;
	};

	_.mixin(searchResults, API);
	return searchResults;
};

module.exports = SearchResults(API);
