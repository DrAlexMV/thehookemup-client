/**
 * Created by austinstone on 3/15/15.
 */

var urlUtils = {};
//TODO: whenever I get internet, I'm sure there is a canonical way to check the validity of URLs.
//Also there may be a smart way of automatically binding this function to the m.prop of handles
urlUtils.checkUrl = function(url) {
	if (_.startsWith(url, 'http://')) {
		return url;
	} else {
		url = 'http://' + url;
		return url;
	}
};

module.exports = urlUtils;

