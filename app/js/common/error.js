var Error = {
	handle: function (response) {
		// TODO: Reroute to error page
		console.log('error', response);
		m.route('/');
	}
};

module.exports = Error;
