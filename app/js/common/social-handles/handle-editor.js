var HandleEditor = function (handleName) {
	var handleEditor = {};

	var availableHandles = {
		facebook:  { icon: 'facebook', tag: 'Facebook', tagClass: 'facebook' },
		twitter: { icon: 'twitter', tag: 'Twitter', tagClass: 'twitter' },
		website: { icon: 'browser', tag: 'Website' },
		'angel-list': { tag: 'Angel List', tagClass: 'angel-list' },
		default: { tag: handleName }
	};


	handleEditor.view = function () {

		var handle = availableHandles[handleName] ? availableHandles[handleName] : availableHandles.default;

		return [
			m('div.ui.right.labeled.left.icon.input', [
				m('i.icon', { class: handle.icon }),
				m('input[type="text"]'),
				m('div.ui.tag.label', { class: handle.tagClass } ,[
					handle.tag
				])
			])
		];
	};

	return handleEditor;
};

module.exports = HandleEditor;