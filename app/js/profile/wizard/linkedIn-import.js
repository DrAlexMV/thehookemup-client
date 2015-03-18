var User = require('model/user');
var ProjectModel = require('model/user-details').ProjectModel;


var LinkedInImport = {};

/* Pulls full user info */
LinkedInImport.pull = function () {
	var deferred = m.deferred();

	IN.User.authorize(function() {
		if (IN.User.isAuthorized()) {
			IN.API.Profile('me').fields(
				'headline',
				'positions',
				'industry',
				'skills',
				'public-profile-url'
			).result(function(res) {
				deferred.resolve(res.values[0]);
			});
		} else {
			deferred.reject();
		}
	}, this);

	return deferred.promise;
};

LinkedInImport.extract = function (linkedInUserInfo) {
	var information = {};

	information.description = linkedInUserInfo.headline;

	information.skills = _.map(linkedInUserInfo.skills.values, function(skill) {
		return skill.skill.name;
	});

	information.projects = _.map(linkedInUserInfo.positions.values, function(position) {
		return new ProjectModel({
			startDate: position.startDate ? position.startDate.year.toString() : '',
			organization: position.company ? position.company.name : '',
			title: position.title,
			description: position.summary ? position.summary : '',
			people: []
		});
	});

	information.linkedInHandle = linkedInUserInfo.publicProfileUrl;
	return information;
};

module.exports = LinkedInImport;
