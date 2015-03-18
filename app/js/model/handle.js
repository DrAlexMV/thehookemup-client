var Handle = function () {
	var handle = {};

	handle.HandleModel = function (handleType) {
		var newHandle = {};

		newHandle.url = m.prop('');
		newHandle.type = m.prop(handleType ? handleType : '');

		return newHandle;
	};

	return handle;
};

module.exports = Handle();
