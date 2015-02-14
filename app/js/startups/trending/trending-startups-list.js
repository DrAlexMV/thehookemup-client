var EntityList = require('profile/entity-list');
var Startups = require('model/startup');

var TrendingStartupsList = function () {
	var trendingStartupsList = {};

	var vm = {
		init: function () {
			var vm = this;

			Startups.getTrending().then(function (startups) {
				vm.startups = startups;
			});
		}
	};

	trendingStartupsList.view = function () {
		return [
			EntityList('Trending Startups', vm.startups, { inSegment: true, ordered: true }).view()
		];
	};

	vm.init();
	return trendingStartupsList;
};

module.exports = TrendingStartupsList;
