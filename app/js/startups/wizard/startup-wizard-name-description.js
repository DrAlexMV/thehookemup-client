var formField = require('common/form-builder').inputs.formField;
var validate = require('common/form-builder').validate;

var StartupWizardNameDescription = function () {
	var startupWizardNameDescription = {};

	var vm = {
		selectedField: m.prop()
	};

	startupWizardNameDescription.rules = {
		name: {
			identifier: 'name',
			rules: [
				{ type: 'empty', prompt: "Please enter your company's name" }
			]
		},
		product: {
			identifier: 'product',
			rules: [
				{ type: 'empty', prompt: "Please enter your company's product description" }
			]
		}
	};

	startupWizardNameDescription.view  = function (ctrl) {

		var fields = [
			{
				label: 'Company Name',
				parameters: {
					name: 'name',
					type: 'text',
					onchange: m.withAttr('value', ctrl.name)
				},
				type: 'input',
				hint: "What is the company's name? Don't worry about the LLC, Inc, etc"
			},
			{
				label: 'Company Website',
				parameters: {
					name: 'website',
					type: 'text',
					onchange: m.withAttr('value', ctrl.website),
					required: false
				},
				type: 'input',
				hint: "What is the company's website? If you have one, enter it here."
			},
			{
				label: 'Product',
				parameters: {
					name: 'product',
					type: 'text',
					onchange: m.withAttr('value', ctrl.product)
				} ,
				type: 'textarea',
				hint: 'Tell us about your product. What is it? What does it help the customer do? Who is the customer?'
			}
		];

		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label.theme-color-main', 'Company Info'),
				m('div.ui.hidden.divider'),
				m('div.ui.stackable.grid', [
					m('div.eight.wide.column', [
						fields.map(function (field, index) {
							var parameters = _.extend(field.parameters, { onfocus: vm.selectedField.bind(this, index) });
							return formField(parameters, field.label, null, field.type, field.required);
						})
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
