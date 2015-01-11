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


Function.prototype.method = function (name, func) {
  this.prototype[name] = func;
  return this;
};

utils.handlePlural = function(string, number) {
	if (number == 1) {
		return string;
	} else {
		return string + 's';
	}
}

module.exports = utils;

