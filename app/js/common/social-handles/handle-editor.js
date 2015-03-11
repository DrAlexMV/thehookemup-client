var startupHandles = require('common/constants').startupHandles;
var userHandles = require('common/constants').userHandles;

var HandleEditor = function (handleName) {
	var handleEditor = {};

	var availableHandles = _.merge(userHandles, startupHandles,
		{'website':{'name':'Website', type:'website', icon:'browser'}},
		{'default':{'name': handleName}});

	handleEditor.view = function (ctrl) {

		var handle = availableHandles[handleName] ? availableHandles[handleName] : availableHandles.default;

		ctrl.type(handleName);

		return [
			m('div.ui.right.labeled.left.icon.input', [
				m('i.icon', { class: handle.icon }),
				m('input[type="text"]', { onchange: m.withAttr('value', ctrl.url) }),
				m('div.ui.tag.label', { class: handle.type }, [
					handle.name
				])
			])
		];
	};

	return handleEditor;
};

module.exports = HandleEditor;