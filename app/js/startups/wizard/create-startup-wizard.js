var StartupWizardNameDescription = require('startups/wizard/startup-wizard-name-description');
var StartupWizardMarkets = require('startups/wizard/startup-wizard-markets');
var StartupWizardHandles = require('startups/wizard/startup-wizard-handles');
var FormBuilder = require('common/form-builder');
var Startup = require('model/startup');

var createStartupWizard = {};

var vm =
createStartupWizard.vm = {
	init: function () {
		var vm = this;

		vm.descriptionSegment = StartupWizardNameDescription();
		vm.marketsSegment = StartupWizardMarkets();
		vm.handlesSegment = StartupWizardHandles();

		vm.rules = _.reduce(_.filter(vm, 'rules'), function (ruleSet, form) {
			ruleSet = _.extend(ruleSet, form.rules);
			return ruleSet;
		}, {});

		vm.errorMessages = m.prop([]);

		vm.validationSuccess = function () {
			vm.errorMessages([]);
			Startup.create().then(function () {

			}, function (res) {
				vm.errorMessages([res.error])
			});
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
					m('h3.ui.centered.header', [
						'Create a Startup Profile'
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
									vm.descriptionSegment.view(vm),
									vm.marketsSegment.view(vm),
									vm.handlesSegment.view(vm)
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
