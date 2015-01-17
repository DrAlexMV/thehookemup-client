var Message = require('common/stream-common').Message;

var SearchRecommendations = function (header) {
	var searchRecommendations = {};

	searchRecommendations.stream = new Bacon.Bus();

	var vm = (function () {
		var vm = {};

		vm.selectedRecommendations = m.prop([]);

		vm.selectRecommendation = function (recommendation) {
			var selected = vm.selectedRecommendations;
			_.contains(selected(), recommendation) ?
				selected(_.without(selected(), recommendation)) : selected().push(recommendation);

			searchRecommendations.stream.push(new Message('RecommendationSelected::SearchRecommendations',
				{ recommendations: selected() }
			));
		};

		return vm;
	})();

	searchRecommendations.view = function (recommendations, alreadySelected) {

		vm.selectedRecommendations(_.intersection(recommendations, alreadySelected));

		return [
			m('div.ui.tall.stacked.left.aligned.segment.recommendation-list', [
				m('h4.ui.header', header),
				m('div.ui.items', [
					recommendations.map(function (recommendation) {
						return m('a.item', { onclick: vm.selectRecommendation.bind(this, recommendation)}, [
							recommendation,
							_.contains(vm.selectedRecommendations(), recommendation) ?
								m('span.ui.right.floated', m('i.check.circle.icon')) : null
						]);
					})
				])
			])
		];
	};

	return searchRecommendations;
};

module.exports = SearchRecommendations;