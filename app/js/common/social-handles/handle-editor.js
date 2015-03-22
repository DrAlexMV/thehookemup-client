var startupHandles = require('common/constants').startupHandles;
var userHandles = require('common/constants').userHandles;

var HandleEditor = function () {
	var handleEditor = {};

	var availableHandles = {};
	_.merge(availableHandles, userHandles, startupHandles, {
		website: {
			name: 'Website',
			type:'website',
			icon:'browser'
		}
	});

	handleEditor.view = function (handleModel, useLabel) {
		//We shouldn't ever see a handle that isn't in the available handles, but
		//in case we do it is handled by setting all the name, type, and icon attributes
		//to the handle name.
		var handle = availableHandles[handleModel.type()] ?
			availableHandles[handleModel.type()] : 
			{
				name: handleModel.type(),
				type: handleModel.type(),
				icon:handleModel.type()
			};

		//Some places there isn't space for the label.
		var containerType = useLabel == false ?
			'div.fluid.ui.left.icon.input' :
			'div.fluid.ui.right.labeled.left.icon.input';

		return [
			m(containerType, [
				m('i.icon', { class: handle.icon }),
				m('input[type="text"]', {
					value: handleModel.url(),
					onchange: m.withAttr('value', handleModel.url)
				}),
				useLabel ?
					m('div.ui.tag.label', {class: handleModel.type() }, [
						handle.name
					]) : null
			])
		];
	};

	return handleEditor;
};

module.exports = HandleEditor;