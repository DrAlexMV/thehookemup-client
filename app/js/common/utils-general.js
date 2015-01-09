/**
 * Created by austinstone on 1/8/15.
 */

var utils = {};

Function.prototype.curry = function () {
  var slice = Array.prototype.slice
  var fn = this
  var args = slice.call(arguments)
  return function () {
    fn.apply(this, args.concat(slice.call(arguments)))
  }
}

utils.handlePlural = function(string, number) {
	if (number == 1) {
		return string;
	} else {
		return string + 's';
	}
}

module.exports = utils;
