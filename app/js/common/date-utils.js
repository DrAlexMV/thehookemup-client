var dateUtils = {};

dateUtils.format = function(utcString) {
	return moment.utc("2015-02-04T20:20:07.609000").local().format('ll');
};

module.exports = dateUtils;
