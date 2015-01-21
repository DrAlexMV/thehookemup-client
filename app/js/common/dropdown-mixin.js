/**
 * Created by austinstone on 1/9/15.
 */

//TODO: Rate limit clicking somehow

var DropdownMixin = function (body, dropdownDivType) {

	var dropdownMixin = {};

	var vm =
	dropdownMixin.vm = {
		body: body
	};

	function config(element, isInitialized) {
		$(element).dropdown()
	}

	dropdownMixin.view = function () {
		return [
			m(dropdownDivType, {config:config},[
				body.view()
			])
		];
	};

	return dropdownMixin;
};

module.exports = DropdownMixin;
