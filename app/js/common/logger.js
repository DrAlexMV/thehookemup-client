var Logger = function (stream) {
	this.stream = stream;

	this.stream.onValue(function (message) {
		console.log(message);
	});
};

module.exports = Logger;