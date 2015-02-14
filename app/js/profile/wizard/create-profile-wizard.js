var ProfileWizardPictureDescription = require('profile/wizard/profile-wizard-picture-description');
var TagInputSegment = require('common/wizards/tag-input-segment');
var ProfileWizardHandles = require('common/wizards/wizard-handles');
var HandleModel = require('model/handle').HandleModel;
var createProfileWizard = {};
var FormBuilder = require('common/form-builder');
var User = require('model/user');
var UserDetails = require('model/user-details');
var StreamCommon = require('common/stream-common');
var ImageModel = require('model/image');

createProfileWizard = {};

var vm =
  createProfileWizard.vm = {
    init: function () {
      var vm = this;

      vm.desiredHandles = ['facebook', 'twitter', 'angel-list', 'website'];
      vm.awaitingResponse = m.prop(false);

      vm.profile = {
        userImageURL: m.prop(),
        description: m.prop(''),
        skills: m.prop([]),
        handles: m.prop(vm.desiredHandles.map(HandleModel))
      };

      vm.pictureDescriptionSegment = ProfileWizardPictureDescription();
      vm.skillsSegment = TagInputSegment({
        tagState: vm.profile.skills,
        ribbonLabel: 'Skills',
        maxCount: 10,
        placeholder: 'Add up to ten skills. After typing a skill, click add.'
      });
      vm.handlesSegment = ProfileWizardHandles();

      vm.rules = _.reduce(_.filter(vm, 'rules'), function (ruleSet, form) {
        ruleSet = _.extend(ruleSet, form.rules);
        return ruleSet;
      }, {});

      vm.errorMessages = m.prop([]);

      vm.validationSuccess = function () {
        vm.errorMessages([]);
        vm.awaitingResponse(true);

        var failure = function (res) {
          vm.errorMessages([res.error])
        };

        //TODO: currently don't have handles in user schema. Once they are there, add handles to submit
        var submit = function () {
          UserDetails.putSkillsByID('me', vm.profile.skills()).then(
            function () {
              User.putByID('me', {'description': vm.profile.description()}).then(
                function () {
                  m.route('/profile/me')
                },
                failure)
            },
            failure)
        };

        submit();
      };

      vm.validationFailure = function (errors) {
        console.log(errors);
        vm.errorMessages(errors);
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
					m('div.ui.form', {
						//TODO: is it possible to highlight the skills input box like we do for other required fields?
						onsubmit: function () {
							if (vm.profile.skills().length == 0) {
								vm.errorMessages().push("Please enter some skills.");
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
									vm.handlesSegment.view({ handles: vm.profile.handles, desiredHandles: vm.desiredHandles })
								])
							]),
							m('div.row', [
								m('div.center.aligned.column', [
									m('div.ui.big.blue.submit.button', 'Finish')
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
