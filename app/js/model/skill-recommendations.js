/**
 *
 * Created by alexanderventura on 1/17/15.
 */

var API = require('common/api');

var SkillRecommendations = function () {
	var skillRecommendations = {},
			recommendations = m.prop([]);

	skillRecommendations.fetch = function () {
		if (recommendations().length > 0) {
			var deferred = m.deferred();

			deferred.resolve(recommendations());

			return deferred.promise;
		} else {
			return skillRecommendations.get('search/skills?results=10').then(function (skills) {
				recommendations(skills);
			});
		}
	};

	_.mixin(skillRecommendations, API);
	return skillRecommendations;
};
