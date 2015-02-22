var API = require('common/api');

var Typeahead = (function(entity, state) {

	var typeahead = {};

	typeahead.getSuggestions = function(params, entity, state) {
		var deferred = m.deferred();
		console.log("PArams are: " + params);
		var stringified = jQuery.param(params);
		console.log("Here in getSuggestions. Stringified is: " + stringified);
		console.log("Entity is: " + entity);
		this.get('/search/autocomplete/' + entity + '?' + stringified).then(
		function(response) {
			console.log("Here in the callback");
			state(response['results'][0]['text']);
			console.log("Results are " + response['results'][0]['text']);
			deferred.resolve(response['results'][0]['text']);
		});
		return deferred.promise;

		
	};

	_.mixin(typeahead, API);
	return typeahead
})();

module.exports = Typeahead;

