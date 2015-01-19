var API = require('common/api');
var User = require('model/user');

var Details = function(API) {
	var details = {};

	details.ProjectModel = function(data) {
		return {
			date: m.prop(data.date),
			title: m.prop(data.title),
			description: m.prop(data.description),
			details: data.details.map(function(detail) {
				return {
					title: m.prop(detail.title),
					description: m.prop(detail.description)
				};
			}),
			people: data.people.map(function(person) {
				return new User.UserModel(person);
			})
		};
	};

	details.DetailsModel = function(data) {
		this.skills = data.skills.map(function(skillName) {
			return m.prop(skillName);
		});

		this.interests = data.interests.map(function(interest) {
			return {
				title: m.prop(interest.title),
				description: m.prop(interest.description)
			};
		});

		this.projects = data.projects.map(function(project) {
			return new details.ProjectModel(project);
		});

		return this;
	};

	details.getByID = function(userID) {
		return this.get('/user/' + userID + '/details', details.DetailsModel);
	};

	details.putSkillsByID = function(userID, skills) {
		return this.put('/user/' + userID + '/details/skills', { skills: skills });
	};

	details.putInterestsByID = function(userID, interests) {
		return this.put('/user/' + userID + '/details/interests', { interests: interests });
	};

	details.putProjectsByID = function(userID, projects) {
		// Convert BasicUsers to IDs
		var projects = projects.map(function(project) {
			var projCopy = _.clone(project);
			projCopy.people = projCopy.people.map(function(person) {
				return m.prop(person._id());
			});
			return projCopy;
		});

		return this.put('/user/' + userID + '/details/projects', { projects: projects });
	};

	_.mixin(details, API);
	return details;
};

module.exports = Details(API);
