var ModalMixin = function (body) {

	var modal = {};
	body.controller();

	var vm =
	modal.vm =  {
		show : m.prop(false),
		isCurrentlyShowing : m.prop(false),
		body: body,

		open : function () {
			vm.show(true);
		},

		close : function () {
			vm.show(false);
		}
	};

	function config(element, isInitialized) {
		if (vm.show() && !vm.isCurrentlyShowing()) {
			$(element).modal('show');
			vm.isCurrentlyShowing(true);
		} else if (!vm.show()) {
			vm.isCurrentlyShowing() && $(element).modal('hide');
			vm.isCurrentlyShowing(false);
		}
	}

	modal.view = function () {
		return [
			m('div.ui.basic.modal', { config: config } , [
				body.view()
			])
		];
	};

	return modal;
};

module.exports = ModalMixin;
