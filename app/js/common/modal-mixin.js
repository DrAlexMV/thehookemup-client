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
  /*
  The modal is considered initialized even if it is not actually showing (i.e. modal('show') hasn't been called).
  Therefore this logic seems necessary. vm.isCurrentlyShowing indicates if the modal is currently displayed, vm.show()
  indicates that the button was clicked to show the modal if true (and it may or may not be showing yet).
   */
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
			m('div.ui.modal', { config: config } , [
				body.view()
			])
		];
	};

	return modal;
};

module.exports = ModalMixin;
