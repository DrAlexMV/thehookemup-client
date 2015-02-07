var formField = require('common/form-builder').inputs.formField;

var StartupWizardNameDescription = function () {
	var startupWizardNameDescription = {};

	var vm = {
		product: m.prop(''),
		name: m.prop(''),
		selectedField: m.prop()
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
			{
				label: 'Company Name',
				parameters: {
					name: 'name',
					type: 'text',
					onchange: m.withAttr('value', vm.name)
				},
				type: 'input',
				hint: "What is the company's name? Don't worry about the LLC, Inc, etc"
			},
			{
				label: 'Product',
				parameters: {
					name: 'product',
					type: 'text',
					onchange: m.withAttr('value', vm.product)
				} ,
				type: 'textarea',
				hint: 'Tell us about your product. What is it? What does it help the customer do? Who is the customer?'
			}
		];

		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label', 'Company Info'),
				m('div.ui.hidden.divider'),
				m('div.ui.stackable.grid', [
					m('div.eight.wide.column', [
						m('div.ui.form', [
							fields.map(function (field, index) {
								var parameters = _.extend(field.parameters, { onfocus: vm.selectedField.bind(this, index) });
								return formField(parameters, field.label, null, field.type);
							})
						])
					]),
					m('div.six.wide.column', [
						m('h5', _.isNumber(vm.selectedField()) ?  fields[vm.selectedField()].hint : null)
					])
				])
			])
		];
	};

	return startupWizardNameDescription;
};

module.exports = StartupWizardNameDescription;
