var StartupWizardNameDescription = require('startups/wizard/startup-wizard-name-description');

var createStartupWizard = {};

var vm =
createStartupWizard.vm = {
	init: function () {
		this.description = StartupWizardNameDescription();
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
			m('div.column', [
				vm.description.view()
			])
		])
	];
};

module.exports = createStartupWizard;
