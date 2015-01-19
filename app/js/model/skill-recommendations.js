/**
 *
 * Created by alexanderventura on 1/17/15.
 */

var API = require('common/api');

var SkillRecommendations = function () {
	var skillRecommendations = {},
			recommendations = m.prop([]);

	skillRecommendations.fetch = function (number) {

		number = number ? number : 10;

		if (recommendations().length > 0) {
			var deferred = m.deferred();

			deferred.resolve(recommendations());

			return deferred.promise;
		} else {
			return skillRecommendations.get('/search/skills?text=&results=' + number).then(function (skills) {
				recommendations(skills);
			});
		}
	};

	_.mixin(skillRecommendations, API);
	return skillRecommendations;
};

module.exports = SkillRecommendations;
