var AttachSocialSegment = require('profile/wizard/attach-social-segment');
var FormBuilder = require('common/form-builder');
var HandleModel = require('model/handle').HandleModel;
var ImageModel = require('model/image');
var LinkedInImport = require('profile/wizard/linkedIn-import');
var ProfileWizardHandles = require('common/wizards/wizard-handles');
var ProfileWizardPictureDescription = require('profile/wizard/profile-wizard-picture-description');
var ProjectsSegment = require('profile/projects-segment');
var StreamCommon = require('common/stream-common');
var TagInputSegment = require('common/wizards/tag-input-segment');
var User = require('model/user');
var UserDetails = require('model/user-details');
var Context = require('common/context');
var UserHandles = require('common/constants').userHandles;


var createProfileWizard = {};

var vm =
	createProfileWizard.vm = {
		init: function () {
			var vm = this;

			vm.awaitingResponse = m.prop(false);

			Context.getCurrentUser().then(function(basicUserInfo) {
				vm.basicInfo = basicUserInfo();
				vm.basicInfo.handles(vm.desiredHandles.map(HandleModel));
			});

			vm.profile = {
				userImageURL: m.prop(),
				description: m.prop(''),
				skills: m.prop([]),
				handles: m.prop(Object.keys(UserHandles).map(function(handleType) {
					return HandleModel({type:handleType, url: ''});
				}))
			};
			vm.pictureDescriptionSegment = ProfileWizardPictureDescription();

			UserDetails.getByID('me').then(function(response) {
				vm.details = response;
				vm.projectsSegment = new ProjectsSegment(vm.profile.projects(), true, 'me');
			});

			vm.skillsSegment = TagInputSegment({
				autocomplete: true,
				entity: 'skills',
				tagState: vm.profile.skills,
				ribbonLabel: 'SKILLS',
				maxCount: 10,
				placeholder: 'Add up to ten skills. After typing a skill, click add.'
			});
			vm.pictureDescriptionSegment = ProfileWizardPictureDescription();
			vm.handlesSegment = ProfileWizardHandles();

			vm.rules = _.reduce(_.filter(vm, 'rules'), function (ruleSet, form) {
				ruleSet = _.extend(ruleSet, form.rules);
				return ruleSet;
			}, {});

			vm.errorMessages = m.prop([]);

			vm.attachSocialSegment = AttachSocialSegment();
			vm.validationSuccess = function () {
				vm.errorMessages([]);
				vm.awaitingResponse(true);

				var failure = function (res) {
					vm.errorMessages([res.error])
				};

				var convertHandles = function () {
					return vm.basicInfo.handles().map(function (handle) {
						return { type: handle.type(), url: handle.url() };
					})
				};

				//TODO:
				var submit = function () {
					UserDetails.putSkillsByID('me', vm.profile.skills()).then(function () {
						UserDetails.putProjectsByID('me', vm.profile.projects()).then(function() {
							User.putByID('me', {
								description: vm.profile.description(),
								handles: convertHandles()
							}).then(function () {
								Context.purge();
								m.route('/profile/me');
							},
							failure)
						}, failure)
					},
					failure)
				};

				submit();
			};

			vm.validationFailure = function (errors) {
				console.log(errors);
				vm.errorMessages(errors);
			};

			vm.importFromLinkedIn = function () {
				function increment(number) {
					state.itemsImported(state.itemsImported() + number);
				}

				var state = vm.linkedInImportState;
				state.status('importing');
				LinkedInImport.pull().then(function (linkedInInfo) {
					var info = LinkedInImport.extract(linkedInInfo);

					vm.profile.description(info.description);
					increment(1);

					// Evil hack to keep reference alive
					vm.profile.projects().push.apply(vm.profile.projects(), info.projects);
					increment(info.projects.length);

					vm.profile.skills(info.skills);
					increment(info.skills.length);

					_.find(vm.profile.handles(), function(handle) {
						return handle.type() === 'linkedin';
					}).url(info.linkedInHandle);
					increment(1);

					if (info.pictureUrl) {
						ImageModel.uploadFromURI(info.pictureUrl).then(function(newImage) {
							vm.profile.userImageURL(newImage.imageID);
							increment(1);

							User.updatePicture('me', newImage.imageID);
							state.status('imported');
						});
					}
				});
			};

			vm.linkedInImportState = {
				status: m.prop('unimported'),
				itemsImported: m.prop(0)
			};

			createProfileWizard.stream = Bacon.mergeAll(vm.pictureDescriptionSegment.vm.profilePicture.stream);
			StreamCommon.on(createProfileWizard.stream,
				'EditableImage::ReplaceImageURL',
				function (message) {

					if (vm.profile.userImageURL()) {
						ImageModel.deleteImage(vm.profile.userImageURL());
					}
					vm.profile.userImageURL(message.parameters.imageID);
					User.updatePicture('me', vm.profile.userImageURL());
				}
			);
		}
	};

createProfileWizard.controller = function () {
	vm.init();
};

createProfileWizard.view = function () {
	function linkedInSegment() {
		var linkedInButton;
		if (vm.linkedInImportState.status() === 'unimported') {
			linkedInButton = m('div.ui.linkedin.button', {
					onclick: vm.importFromLinkedIn
				},[
					m('i.linkedin.icon'),
					'Import from LinkedIn'
				]
			);
		} else if (vm.linkedInImportState.status() === 'importing') {
			linkedInButton =  m('div.ui.loading.linkedin.button',
				[m('i.linkedin.icon'), 'Import from LinkedIn']);
		} else if (vm.linkedInImportState.status() === 'imported') {
			linkedInButton =  m('div.ui.disabled.linkedin.button',
				[m('i.linkedin.icon'), 'Import from LinkedIn']);
		}
		return m('div.ui.segment', [
			linkedInButton,
			vm.linkedInImportState.status() === 'imported' ? [
				m('i.checkmark.green.icon'),
				m('b', 'Successfully imported ' +
					vm.linkedInImportState.itemsImported() +
					' items.')
			] : null
		]);
	}

	return [
		m('div.ui.page.grid', [
			m('div.row', [
				m('div.column', [
					m('div', [
						m('h1#create-startup-header.ui.centered.header', [
							'Create a Profile'
						])
					])
				])
			]),
			m('div.row', [
				m('div.column', [
					linkedInSegment()
				])
			]),
			m('div.row', [
				m('div.column', [
					m('div.ui.form', {
						//TODO: is it possible to highlight the skills input box like we do for other required fields?
						onsubmit: function () {
							if (vm.profile.skills().length == 0) {
								vm.errorMessages().push('Please enter a few skills.');
							}
						},
						class: vm.errorMessages().length ? 'warning' : null,
						config: FormBuilder.validate(vm.rules, vm.validationSuccess, vm.validationFailure) }, [
						m('div.ui.warning.message', [
							m('div.header', 'Oops!'),
							m('ul', [
								vm.errorMessages().map(function (message) {
									return m('li', message);
								})
							])
						]),
						m('div.ui.grid', [
							m('div.row', [
								m('div.column', [
									vm.pictureDescriptionSegment.view({ description: vm.profile.description, userImageURL: vm.profile.userImageURL}),
									vm.skillsSegment.view(),
									vm.attachSocialSegment.view(),
									vm.projectsSegment.view({connections: []}),
									vm.handlesSegment.view({ handles: vm.profile.handles, desiredHandles: vm.desiredHandles })
								])
							]),
							m('div.row', [
								m('div.center.aligned.column', [
									m('div.ui.big.blue.submit.button', 'Create My Profile')
								])
							])
						])
					])
				])
			])
		])
	];
};

module.exports = createProfileWizard;
