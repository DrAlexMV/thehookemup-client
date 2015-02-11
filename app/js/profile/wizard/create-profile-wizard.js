/**
 * Created by austinstone on 2/10/15.
 */
var ProfileWizardPictureDescription = require('profile/wizard/profile-wizard-picture-description');
var TagInputSegment = require('common/wizards/tag-input-segment');
var ProfileWizardHandles = require('common/wizards/wizard-handles');
var HandleModel = require('model/handle').HandleModel;
var createProfileWizard = {};
var FormBuilder = require('common/form-builder');
var user = require('model/user');

var vm =
  createProfileWizard.vm = {
    init: function () {
      var vm = this;

      vm.desiredHandles = ['facebook', 'twitter', 'angel-list', 'website'];
      vm.awaitingResponse = m.prop(false);

      vm.profile = {
        picture: m.prop(),
        description: m.prop(''),
        skills: m.prop([]),
        interests: m.prop([]),
        handles: m.prop(vm.desiredHandles.map(HandleModel))
      };

      vm.pictureDescriptionSegment = ProfileWizardPictureDescription();
      vm.skillsSegment = TagInputSegment({
          tagState: vm.profile.skills,
          ribbonLabel: 'Skills',
          maxCount: 10,
          placeholder: 'Enter up to ten skills.'
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

        var newProfile = {
          description: vm.profile.description(),
          skills: vm.profile.skills(),
          handles: vm.startup.handles().map(function (handle) { return { type: handle.type(), url: handle.url() }; })
        };

       /* var success = function (startup) {
          m.route('/startups/' + startup._id());
        }; */

        var failure = function (res) {
          vm.errorMessages([res.error])
        };

        /*Profile.create(newStartup)
          .then(success, failure)
          .then(vm.awaitingResponse.bind(this, false));*/
      };

      vm.validationFailure = function (errors) {
        console.log(errors);
        vm.errorMessages(errors);
      };


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
          m('div.ui.form',{
            onsubmit: function() {
              if (vm.profile.skills().length == 0) {
                vm.errorMessages().push("Please enter some skills.");
              }
            },
            class: vm.errorMessages().length ? 'warning' : null,
            config: FormBuilder.validate(vm.rules, vm.validationSuccess, vm.validationFailure) },
            [
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
                  vm.pictureDescriptionSegment.view({ description: vm.profile.description }),
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
