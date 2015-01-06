var StreamCommon = {

	/**
	 * Helper function to filter out events in a stream with a given name
	 *
	 * @param stream
	 * @param eventName
	 * @param cb
	 * @returns {*}
	 */
	on: function (stream, messageNames, cb, redraw) {
		var wrapRedraw = function (fn) {
			return function (args) {
				fn(args);
				m.redraw();
			}
		};

		return stream.filter(function (message) {
			if (Array.isArray(messageNames)) {
				return messageNames.indexOf(message.name) > -1;
			}
			return message.name === messageNames;
		}).onValue(redraw ? wrapRedraw(cb) : cb);
	},

	/**
	 * Message object for message passing using BaconJS Bus
	 *
	 * @param name
	 * @param parameters
	 * @constructor
	 */
	Message: function (name, parameters) {
		this.name = name ? name : 'UNNAMED';
		this.parameters = parameters ? parameters : {};
	}
};

module.exports = StreamCommon;
