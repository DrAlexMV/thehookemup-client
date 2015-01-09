/**
 * Created by austinstone on 1/8/15.
 */

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
