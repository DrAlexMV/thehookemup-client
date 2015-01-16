/**
 * Provides search page
 */

var Error = require('common/error');
var SearchFilterForm = require('search/search-filter-form');
var SearchResults = require('model/search-results');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserListBig = require('search/user-list-big');
var Pagination = require('common/ui-core/pagination');
var SearchRecommendations = require('search/search-recommendations');

var search = {};

var vm =
search.vm = {
	init: function () {
		var vm = this;

		vm.fields = SearchResults.extractFields(m.route);
		vm.query_string = m.route.param('query_string');

		vm.pagination = Pagination();
		vm.skillRecommendations = SearchRecommendations('Skills');
		vm.roleRecommendations = SearchRecommendations('Roles');
		vm.searchFilterForm = new SearchFilterForm(SearchResults.normalizeFields(vm.fields));

		vm.skills = m.prop(['Java', 'Javascript', 'Web Development', 'Marketing']);
		vm.roles = m.prop(['Founder', 'Startupper', 'Investor']);

		search.stream = Bacon.mergeAll(vm.searchFilterForm.stream, vm.roleRecommendations.stream,
			vm.skillRecommendations.stream);

		SearchResults.getResults(this.fields).then(function(response) {
				vm.searchResults = response;
		}, Error.handle);

		StreamCommon.on(search.stream, 'SearchFilterForm::Search', function (message) {
			var params = message.parameters;
			// Clean parameters
			var nonEmptyFields = {}; // ugly and not functional-style
			Object.keys(params)
				.filter(function(key) { return params[key]; })
				.forEach(function(key) { nonEmptyFields[key] = params[key]; });

			if (search.vm.query_string) { nonEmptyFields.query_string = search.vm.query_string; }

			m.route(SearchResults.buildURL(nonEmptyFields));
		});

		StreamCommon.on(search.stream, 'RecommendationSelected::SearchRecommendations', function (message) {
			vm.query_string = message.parameters.recommendation;
			m.route(SearchResults.buildURL({ query_string: vm.query_string }));
		});
	}
};

search.controller = function () {
	search.vm.init();
};

search.view = function () {
	return [
		m('div.base.ui.padded.stackable.page.grid', [
			m('div.row', [
				m('div.ten.wide.column', [
					m('h2.ui.header', vm.query_string)
				])
			]),
			m('div#search-area.ui.segment.row', [
				m('div.four.wide.column', [
					m('div.ui.grid', [
						m('div.row', [
							m('div.column', vm.skillRecommendations.view(vm.skills()))
						]),
						m('div.row', [
							m('div.column', vm.roleRecommendations.view(vm.roles()))
						])
					])
				]),
				m('div#search-results.twelve.wide.column', [
					vm.searchResults.results().length ?
						new UserListBig(vm.searchResults.results()).view({}) : m('div', 'No results found!'),
					m('div.row', [
						m('div.right.aligned.column', vm.searchResults.results().length ? vm.pagination.view(1) : null)
					])
				])
			])
		])
	];
};

module.exports = search;
