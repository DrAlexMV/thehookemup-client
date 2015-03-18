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

var createProfileWizard = {};

var vm =
	createProfileWizard.vm = {
		init: function () {
			var vm = this;

			vm.desiredHandles = [
				'linkedin',
				'github',
				'facebook',
				'twitter',
				'google-plus',
				'angel-list',
				'website'
			];

			vm.awaitingResponse = m.prop(false);

			Context.getCurrentUser().then(function(basicUserInfo) {
				vm.basicInfo = basicUserInfo();
				vm.basicInfo.handles(vm.desiredHandles.map(HandleModel));
			});

			vm.profile = {
				userImageURL: m.prop(),
				description: m.prop(''),
				skills: m.prop([]),
				projects: m.prop([]),
				handles: m.prop(vm.desiredHandles.map(HandleModel))
			};

			UserDetails.getByID('me').then(function(response) {
				vm.details = response;
				vm.projectsSegment = new ProjectsSegment(vm.profile.projects(), true, 'me');
			});

			vm.skillsSegment = TagInputSegment({
				autocomplete: true,
				entity: 'skills',
				tagState: vm.profile.skills,
				ribbonLabel: 'Skills',
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
				LinkedInImport.pull().then(function (linkedInInfo) {
					var info = LinkedInImport.extract(linkedInInfo);
					vm.profile.description(info.description);

					// Evil hack to keep reference alive
					vm.profile.projects().push.apply(vm.profile.projects(), info.projects);
					vm.profile.skills(info.skills);
					_.find(vm.profile.handles(), function(handle) {
						return handle.type() === 'linkedin';
					}).url(info.linkedInHandle);
					_.forEach(vm.profile.handles(), function(r) {console.log(r.url())});
					m.redraw();
				});
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
	var importFromLinkedInButton =
		m('div.ui.linkedin.button', {
				onclick: vm.importFromLinkedIn
			},[
				m('i.linkedin.icon'),
				'Import from LinkedIn'
			]
		);

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
					m('div.ui.segment',
						importFromLinkedInButton
					)
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
									m('div.ui.big.blue.submit.button', 'Update My Profile')
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
