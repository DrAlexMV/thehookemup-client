var HandleEditor = require('common/social-handles/handle-editor');

var StartupWizardHandles = function () {
	var handles = {};

	var vm = {
	};

	handles.view = function (vm) {

		var desiredHandles = ['facebook', 'twitter', 'angel-list', 'website'];

		var handleEditorWrap = function (handle) {
			return m('div.eight.wide.field', [
				HandleEditor(handle).view(vm)
			]);
		};

		var handleFields = _.chain(desiredHandles)
			.map(handleEditorWrap)
			.groupBy(function (element, index) { return Math.floor(index / 2); })
			.map(function (handleGroup) { return m('div.fields', handleGroup); })
			.value();

		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label', 'Handles'),
				m('div.ui.hidden.divider'),
				m('div.ui.form',  handleFields)
			])
		];
	};

	return handles;
};

module.exports = StartupWizardHandles;
