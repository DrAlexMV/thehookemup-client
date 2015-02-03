var FormBuilder = require('common/form-builder');

var StartupWizardNameDescription = function () {
	var startupWizardNameDescription = {};

	var vm = {
		description: m.prop(''),
		name: m.prop('')
	};

	var rules = {
		password: {
			identifier: 'password',
			rules: [
				{ type: 'empty', prompt: 'please enter a password' },
				{ type: 'length[8]', prompt: 'your password must be at least 8 characters' }
			]
		},
		confirm: {
			identifier: 'confirm-password',
			rules: [
				{ type: 'empty', prompt: 'please confirm your password' },
				{ type: 'match[password]', prompt: 'your passwords do not match' }
			]
		},
		'first-name': {
			identifier: 'first-name',
			rules: [
				{ type: 'empty', prompt: 'please enter your first name' }
			]
		},
		'last-name': {
			identifier: 'last-name',
			rules: [
				{ type: 'empty', prompt: 'please enter your last name' }
			]
		},
		'email': {
			identifier: 'email',
			rules: [
				{ type: 'empty', prompt: 'please enter your email' },
				{ type: 'email', prompt: 'please enter a valid email' }
			]
		}
	};

	startupWizardNameDescription.view  = function () {
		var fields = [
			{ parameters: { name: 'name', placeholder: 'Company Name', onchange: m.withAttr('value', vm.name) } },
			{ parameters: { name: 'description', placeholder: 'Description', onchange: m.withAttr('value', vm.description) } }
		];

		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label', 'Company Info'),
				fields.map(function (field) {
					return m('input')
				})
			])
		];
	};

	return startupWizardNameDescription;
};

module.exports = StartupWizardNameDescription;
