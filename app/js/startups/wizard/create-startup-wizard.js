var StartupWizardNameDescription = require('startups/wizard/startup-wizard-name-description');
var StartupWizardHandles = require('common/wizards/wizard-handles');
var FormBuilder = require('common/form-builder');
var Startup = require('model/startup');
var HandleModel = require('model/handle').HandleModel;
var TagInputSegment = require('common/wizards/tag-input-segment');
var StartupHandles = require('common/constants').startupHandles;
var createStartupWizard = {};

var vm =
	createStartupWizard.vm = {
		init: function () {
			var vm = this;

			vm.awaitingResponse = m.prop(false);

			vm.startup = {
				name: m.prop(''),
				description: m.prop(''),
				markets: m.prop([]),
				handles: m.prop(Object.keys(StartupHandles).map(function(handle) {
						return HandleModel(handle);
					})),
				website: m.prop('')
			};

			vm.descriptionSegment = StartupWizardNameDescription();
			vm.marketsSegment = TagInputSegment({
				autocomplete: true,
				entity: 'markets',
				tagState: vm.startup.markets,
				ribbonLabel: 'Markets',
				maxCount: 4,
				placeholder: 'Enter up to four markets.'
			});

			vm.handlesSegment = StartupWizardHandles();

			vm.rules = _.reduce(_.filter(vm, 'rules'), function (ruleSet, form) {
				ruleSet = _.extend(ruleSet, form.rules);
				return ruleSet;
			}, {});

			vm.errorMessages = m.prop([]);

			vm.validationSuccess = function () {
				vm.errorMessages([]);
				vm.awaitingResponse(true);

				var newStartup = {
					name: vm.startup.name(),
					website: vm.startup.website(),
					description: vm.startup.description(),
					markets: vm.startup.markets(),
					handles: vm.startup.handles()
				};

				var success = function (startup) {
					m.route('/startups/' + startup._id());
				};

				var failure = function (res) {
					vm.errorMessages([res.error])
				};

				Startup.create(newStartup)
					.then(success, failure)
					.then(vm.awaitingResponse.bind(this, false));
			};

			vm.validationFailure = function (errors) {
				console.log(errors);
				vm.errorMessages(errors);
			};
		}
	};

createStartupWizard.controller = function () {
	vm.init();
};

createStartupWizard.view = function () {
	return [
		m('div.ui.page.grid', [
			m('div.row', [
				m('div.column', [
					m('div', [
						m('h1#create-startup-header.ui.centered.header', [
							'Create a Startup Profile'
						])
					])
				])
			]),
			m('div.row', [
				m('div.column', [
					m('div.ui.form', { class: vm.errorMessages().length ? 'warning' : null,
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
									vm.descriptionSegment.view({ name: vm.startup.name, product: vm.startup.description, website: vm.startup.website }),
									vm.marketsSegment.view(),
									vm.handlesSegment.view(vm.startup.handles)
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

module.exports = createStartupWizard;
