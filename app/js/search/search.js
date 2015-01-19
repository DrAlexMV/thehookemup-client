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
var SkillRecommendations = require('model/skill-recommendations');

var search = {};

var vm =
search.vm = {
	init: function () {
		var vm = this;

		vm.fields = SearchResults.extractFields(m.route);
		vm.query_string = m.route.param('query_string');
		vm.currentPage = m.prop(_.parseInt(m.route.param('page')) || 0);

		vm.pagination = Pagination();
		vm.numberOfPages = m.prop();
		vm.skillRecommendations = SearchRecommendations('Skills');
		vm.roleRecommendations = SearchRecommendations('Roles');

		vm.roles = m.prop(['Founder', 'Startupper', 'Investor']);

		search.stream = Bacon.mergeAll(vm.roleRecommendations.stream, vm.skillRecommendations.stream, vm.pagination.stream);

		SkillRecommendations().fetch().then(function (skills) {
			vm.skills = m.prop(_.pluck(skills, 'name'));
		});

		vm.search = function (query) {
			var resultsPerPage = 5;
			query = _.extend(query, { results_per_page: resultsPerPage,  page: vm.currentPage() });
			SearchResults.getResults(query).then(function(response) {
				vm.searchResults = response;
				vm.numberOfPages(vm.pagination.utils.numberOfPages(resultsPerPage, response.metadata().numberResults));
			}, Error.handle);
		};

		vm.search(vm.fields);

		StreamCommon.on(search.stream, 'RecommendationSelected::SearchRecommendations', function (message) {
			vm.query_string = message.parameters.recommendations.join(' ');
			var query = { query_string: vm.query_string, page: vm.currentPage() };
			m.route(SearchResults.buildURL(query));
		});

		StreamCommon.on(search.stream, 'PageSelected::Pagination', function (message) {
			vm.currentPage(message.parameters.page);
			var query = { query_string: vm.query_string, page: vm.currentPage() };
			m.route(SearchResults.buildURL(query));
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
				m('div.sixteen.wide.column', [
					m('h2.ui.header', vm.query_string ? vm.query_string : 'All')
				])
			]),
			m('div#search-area.ui.segment.row', [
				m('div.four.wide.column', [
					m('div.ui.grid', [
						m('div.row', [
							m('div.column', vm.skillRecommendations.view(vm.skills(), vm.query_string.split(' ')))
						]),
						m('div.row', [
							m('div.column', vm.roleRecommendations.view(vm.roles(), vm.query_string.split(' ')))
						])
					])
				]),
				m('div#search-results.twelve.wide.column', [
					vm.searchResults.results().length ?
						new UserListBig(vm.searchResults.results()).view({}) : m('div', 'No results found!'),
					m('div.row', [
						m('div.right.aligned.column', vm.searchResults.results().length ?
							vm.pagination.view(vm.numberOfPages(), vm.currentPage()) : null)
					])
				])
			])
		])
	];
};

module.exports = search;
