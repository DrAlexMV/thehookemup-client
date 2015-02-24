/**
 * Created by austinstone on 2/23/15.
 */


var API = require('common/api');

var AutocompleteResults = function(API) {
	var autocompleteResults = {};


	autocompleteResults.resultsModel = function(data) {
		return data['results']
	};

	autocompleteResults.getSuggestions = function (entity, params) {
		var stringified = jQuery.param(params);
		return this.get('/search/autocomplete/' + entity + '?' + stringified, autocompleteResults.resultsModel);
	};

	_.mixin(autocompleteResults, API);
	return autocompleteResults;
};

module.exports = AutocompleteResults(API);

