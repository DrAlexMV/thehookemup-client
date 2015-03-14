/**
 * Created by alexanderventura on 2/9/15.
 */

var Handle = function () {
	var handle = {};

	handle.HandleModel = function (handle) {
		var newHandle = {};

		newHandle.url = m.prop('');
		newHandle.type = m.prop(handle);

		return newHandle;
	};

	return handle;
};

module.exports = Handle();
