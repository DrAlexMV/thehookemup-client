/**
 * Provides search page
 * @jsx m
 */

var Error = require('common/error');
var FormBuilder = require('common/form-builder');
var SearchFilterForm = require('search/search-filter-form');
var SearchResults = require('model/search-results');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserListBig = require('search/user-list-big');

var search = {};

search.vm = {
	init: function () {
		this.query_string = m.route.param('query_string');

		this.fields = SearchResults.extractFields(m.route);

		this.searchResults = null;
		SearchResults.getResults(this.fields).then(
			function(response) {
				search.vm.searchResults = response;
			}, Error.handle);
	
		this.searchFilterForm = new SearchFilterForm(SearchResults.normalizeFields(this.fields));

		search.stream = Bacon.mergeAll(this.searchFilterForm.stream);

		StreamCommon.on(search.stream, 'SearchFilterForm::Search', function (message) {
			var params = message.parameters;
			// Clean parameters
			var nonEmptyFields = {}; // ugly and not functional-style
			Object.keys(params)
				.filter(function(key) { return params[key]; })
				.forEach(function(key) { nonEmptyFields[key] = params[key]; });

			if (search.vm.query_string) {
				nonEmptyFields.query_string = search.vm.query_string;
			}
			m.route(SearchResults.buildURL(nonEmptyFields));
		});
	}
};

search.controller = function () {
	search.vm.init();
};

search.view = function () {
	var vm = search.vm;
	return (
		<div className="base ui padded stackable grid">
			<div className="row">
				<div className="four wide column"></div>
				<div className="ten wide column">
					<h2 className="ui header">
						Search - &quot;{search.vm.query_string}&quot;
					</h2>
				</div>
				<div className="two wide column"></div>
			</div>
			<div className="row">
				<div className="four wide column">
					<div className="ui segment">
						<h4 className="ui header">Refine Search</h4>
						{ vm.searchFilterForm.view({}) }
					</div>
				</div>
				<div className="ten wide column">
					<div className="ui segment">
					{ vm.searchResults && vm.searchResults.results().length ?
						(new UserListBig(search.vm.searchResults.results())).view({})
						: <div>No results found</div>
					}

					</div>
				</div>
				<div className="two wide column"></div>
			</div>
		</div>
	);
};

module.exports = search;
