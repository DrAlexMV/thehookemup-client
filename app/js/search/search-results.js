var Pagination = require('common/ui-core/pagination');
var UserListBig = require('search/user-list-big');

var SearchResults = function () {

	var searchResults = {};

	var vm = {
		currentPage: m.prop(_.parseInt(m.route.param('page')) || 0),
		pagination: Pagination(),
		numberOfPages: m.prop()
	};

	searchResults.view = function (results) {
		return [
			m('div#search-results', [
				results.length ? UserListBig(results).view() : m('div', 'No results found!'),
				m('div.row', [
					m('div.right.aligned.column', results.length ? vm.pagination.view(vm.numberOfPages(), vm.currentPage()) : null)
				])
			])
		];
	};
};

module.exports = SearchResults;
