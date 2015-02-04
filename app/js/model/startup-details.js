var API = require('common/api');
var User = require('model/user');

var StartupDetails = function(API) {
	var startupDetails = {};

	startupDetails.WallPostModel = function(data) {
		this.id = m.prop(data.id);
		this.date = m.prop(data.date);
		this.message = m.prop(data.message);
		this.user = new User.UserModel(data.user);
		return this;
	};

	startupDetails.QuestionAnswerModel = function(data) {
		this.id = m.prop(data.id);
		this.date = m.prop(data.date);
		this.status = m.prop(data.status);
		this.asker = new User.UserModel(data.asker);
		this.question = m.prop(data.question);
		this.answer = m.prop(data.answer);
		return this;
	};

	startupDetails.StartupDetailsModel = function(data) {
		this.qa = data.qa.map(function(questionAnswer) {
			return new startupDetails.QuestionAnswerModel(questionAnswer);
		});

		this.wall = data.wall.map(function(wallPost) {
			return new startupDetails.WallPostModel(wallPost);
		});

		this.people = data.people.map(function(person) {
			return new User.UserModel(person);
		});

		this.overview = m.prop(data.overview);
		return this;
	};

	startupDetails.getByID = function(startupID) {
		return this.get('/startup/' + startupID + '/details', startupDetails.StartupDetailsModel);
	};

	startupDetails.updatePeople = function(startupID, personIDs) {
		return this.put('/startup/' + startupID + '/details/people', {people: personIDs});
	};

	startupDetails.updateOverview = function(startupID, newOverview) {
		return this.put('/startup/' + startupID + '/details/overview', {overview: newOverview});
	};

	startupDetails.addWallPost = function(startupID, message) {
		return this.post('/startup/' + startupID + '/details/wall', {message: message});
	};

	startupDetails.deleteWallPost = function(startupID, postID) {
		return this.delete('/startup/' + startupID + '/details/wall/' + postID);
	};

	startupDetails.askQuestion = function(startupID, questionText) {
		return this.post('/startup/' + startupID + '/details/qa', {question: questionText});
	};

	startupDetails.answerQuestion = function(startupID, questionID, answerText) {
		return this.put('/startup/' + startupID + '/details/qa/' + questionID, {answer: answerText});
	};

	startupDetails.deleteQuestion = function(startupID, questionID) {
		return this.delete('/startup/' + startupID + '/details/qa/' + questionID, {});
	};

	_.mixin(startupDetails, API);
	return startupDetails;
};

module.exports = StartupDetails(API);
