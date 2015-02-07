var StartupWizardNameDescription = require('startups/wizard/startup-wizard-name-description');
var StartupWizardMarkets = require('startups/wizard/startup-wizard-markets');
var StartupWizardHandles = require('startups/wizard/startup-wizard-handles');

var createStartupWizard = {};

var vm =
createStartupWizard.vm = {
	init: function () {
		this.description = StartupWizardNameDescription();
		this.markets = StartupWizardMarkets();
		this.handles = StartupWizardHandles();
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
					vm.description.view(),
					vm.markets.view(),
					vm.handles.view()
				])
			])
		])
	];
};

module.exports = createStartupWizard;
