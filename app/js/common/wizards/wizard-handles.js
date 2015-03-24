var HandleEditor = require('common/social-handles/handle-editor');

var WizardHandles = function () {
	var handles = {};

	handles.view = function (handles) {

		var handleEditorWrap = function (handle) {
			return m('div.eight.wide.field', [
				HandleEditor().view(handle, true)
			]);
		};

		var handleFields = _.chain(handles())
			.map(handleEditorWrap)
			.groupBy(function (element, index) { return Math.floor(index / 2); })
			.map(function (handleGroup) { return m('div.fields', handleGroup); })
			.value();

		return [
			m('div.ui.segment', [
				m('a.ui.ribbon.label.theme-color-main', 'Handles'),
				m('div.ui.hidden.divider'),
				m('div.ui.form',  handleFields)
			])
		];
	};

	return handles;
};

module.exports = WizardHandles;
