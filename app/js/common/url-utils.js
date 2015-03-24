/**
 * Created by austinstone on 3/15/15.
 */

var urlUtils = {};
//There may be a smart way of automatically binding this function to the m.prop of handles
urlUtils.fixUrl = function(url) {
	if (/^(f|ht)tps?:\/\//i.test(url)) {
		return url;
	} else {
		url = 'http://' + url;
		return url;
	}
};

module.exports = urlUtils;

