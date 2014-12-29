var StreamCommon = {

	/**
	 * Helper function to filter out events in a stream with a given name
	 *
	 * @param stream
	 * @param eventName
	 * @param cb
	 * @returns {*}
	 */
	on: function (stream, messageName, cb) {
		return stream.filter(function (message) {
			return message.name === messageName;
		}).subscribe(cb);
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
