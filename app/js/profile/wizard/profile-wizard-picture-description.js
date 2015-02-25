var formField = require('common/form-builder').inputs.formField;
var validate = require('common/form-builder').validate;
var EditableImage = require('common/editable-image');

var ProfileWizardPictureDescription = function () {

	var profileWizardPictureDescription = {};

	var vm = profileWizardPictureDescription.vm = {
		profilePicture: new EditableImage(),
		selectedFieldText: m.prop()
	};

	profileWizardPictureDescription.rules = {
		description: {
			identifier: 'description',
			rules: [
				{ type: 'empty', prompt: "Please enter a description." }
			]
		}
	};

	profileWizardPictureDescription.view = function (ctrl) {

		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label.theme-color-main', 'Basic Info'),
				m('div.ui.stackable.grid', [
					m('div.four.wide.column', [
						m('h5', 'Upload a profile picture.'),
						vm.profilePicture.view({
							userImageURL: ctrl.userImageURL(),
							editable: true,
							imageClasses: 'tiny'
						})
					]),
					m('div.twelve.wide.column', [
						m('br'),
						m('br'),
						formField({
							name: 'description',
							type: 'text',
							onchange: m.withAttr('value', ctrl.description),
							placeholder: 'Enter a one sentence description of yourself.'
						}, 'Description', null, 'input')
					])
				])
			])
		];
	};

	return profileWizardPictureDescription;
};

module.exports = ProfileWizardPictureDescription;
