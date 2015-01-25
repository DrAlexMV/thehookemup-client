var Context = require('common/context');
var Error = require('common/error');
var ImageModel = require('model/image');
var MessageFeed = require('startups/message-feed');
var StartupModel = require('model/startup');
var StartupDetailsModel = require('model/startup-details');
var StartupProfileHeader = require('startups/startup-profile-header');
var StartupOverview = require('startups/startup-overview');
var StartupFounders = require('startups/startup-founders');
var QuestionAnswer = require('startups/question-answer');
var StreamCommon = require('common/stream-common');

var startups = {};

var vm =
startups.vm = {
	init: function () {
		vm.startupID = m.route.param('startupid');

		vm.header = new StartupProfileHeader();
		vm.messageFeed = new MessageFeed();
		vm.overview = new StartupOverview();
		vm.questionAnswer = new QuestionAnswer();
		vm.founders = new StartupFounders();

		vm.currentPage = m.prop('overview');

		vm.pages = {
			overview: function() { return [vm.overview.view(), vm.founders.view()]; },
			followers: function() { return null; },
			qa: function() { return vm.questionAnswer.view({ qa: vm.startupDetails.qa }); },
			funding: function() { return null; },
			jobs: function() { return null; }
		};

		StartupModel.getByID(vm.startupID).then(function(response) {
			vm.startupBasic = response;
			vm.editable = response.isOwner();
		}, Error.handle);


		StartupDetailsModel.getByID(vm.startupID).then(function(response) {
			vm.startupDetails = response;
		}, Error.handle);

		Context.getCurrentUser().then(function(currentUser) {
			vm.currentUser = currentUser;
		});

		startups.stream = Bacon.mergeAll(
			vm.header.vm.profilePicture.stream,
			vm.header.stream,
			vm.messageFeed.stream,
			vm.questionAnswer.stream
		);

		StreamCommon.on(vm.header.stream,
			'StartupProfileHeader::Update',
			function (message) {
				var vals = message.parameters;
				StartupModel.putByID(vm.startupID, vals);
				vm.startupBasic.name(vals.name);
				vm.startupBasic.website(vals.website);
				vm.startupBasic.description(vals.description);
				vm.startupBasic.categories(vals.categories);
				vm.startupBasic.handles(vals.handles.map(function(handle) {
					return {type: handle.type, url: handle.url};
				}));
			}
		);

		StreamCommon.on(vm.header.stream,
			'StartupProfileHeader::ChangePage',
			function (message) {
				vm.currentPage(message.parameters.currentPage);
			}
		);

		StreamCommon.on(vm.header.vm.profilePicture.stream,
			'EditableImage::ReplaceImageURL',
			function (message) {
				if (vm.startupBasic.picture()) {
					ImageModel.deleteImage(vm.startupBasic.picture());
				}
				vm.startupBasic.picture(message.parameters.imageID);
				StartupModel.putByID(vm.startupID, {picture: vm.startupBasic.picture()});
			}
		);

		StreamCommon.on(vm.messageFeed.stream,
			'MessageFeed::Post',
			function (message) {
				StartupDetailsModel.addWallPost(vm.startupID, message.parameters.message).then(function(response) {
					var newMessage = new StartupDetailsModel.WallPostModel(response);
					vm.startupDetails.wall.splice(0, 0, newMessage);
				});
			}
		);

		StreamCommon.on(vm.questionAnswer.stream,
			'QuestionAnswer::Answer',
			function (message) {
				StartupDetailsModel.answerQuestion(vm.startupID, message.parameters.id, message.parameters.answer).then(function(response) {
					vm.startupDetails.qa[message.parameters.index].answer(message.parameters.answer);
				});
			},
			true
		);
	}
};

startups.controller = function () {
	vm.init();
};

startups.view = function () {
	return [
		m('div.ui.grid', [
			m('div.ui.centered.row', [
				m('div.fourteen.wide.column', [
					vm.header.view({
						startupBasic: vm.startupBasic,
						editable: vm.editable
					}),
					m('div.ui.hidden.divider'),
					m('div.ui.stackable.grid', [
						m('div.row', [
							m('div.eleven.wide.column', [
								vm.pages[vm.currentPage()]()
							]),
							m('div.five.wide.column', [
								vm.messageFeed.view({
									messages: vm.startupDetails.wall,
									currentUser: vm.currentUser(),
									startupName: vm.startupBasic.name(),
									isOwner: vm.startupBasic.isOwner()
								})
							])
						])
					])
				])
			])
		])
	];
};

module.exports = startups;
