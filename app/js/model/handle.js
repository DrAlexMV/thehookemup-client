var Handle = function () {
	var handle = {};

	handle.HandleModel = function (data) {
		var newHandle = {};

		newHandle.url = m.prop(data.url);
		newHandle.type = m.prop(data.type);

		return newHandle;
	};

	return handle;
};

module.exports = Handle();
