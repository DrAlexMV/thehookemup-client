var Message = require('common/stream-common').Message;

var SearchRecommendations = function (header) {
	var searchRecommendations = {};

	searchRecommendations.stream = new Bacon.Bus();

	var vm = (function () {
		var vm = {};

		vm.selectRecommendation = function (recommendation) {
			searchRecommendations.stream.push(new Message('RecommendationSelected::SearchRecommendations',
				{ recommendation: recommendation }
			));
		};

		return vm;
	})();

	searchRecommendations.view = function (recommendations) {

		return [
			m('div.ui.tall.stacked.left.aligned.segment.recommendation-list', [
				m('h4.ui.header', header),
				m('div.ui.items', [
					recommendations.map(function (recommendation) {
						return m('a.item', { onclick: vm.selectRecommendation.bind(this, recommendation)} , recommendation);
					})
				])
			])
		];
	};

	return searchRecommendations;
};

module.exports = SearchRecommendations;