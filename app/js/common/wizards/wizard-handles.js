var HandleEditor = require('common/social-handles/handle-editor');

var WizardHandles = function () {
	var handles = {};

	handles.view = function (ctrl) {

		var handleEditorWrap = function (handle, index) {
			return m('div.eight.wide.field', [
				HandleEditor(handle).view(ctrl.handles()[index])
			]);
		};

		var handleFields = _.chain(ctrl.desiredHandles)
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

module.exports = WizardHandles;