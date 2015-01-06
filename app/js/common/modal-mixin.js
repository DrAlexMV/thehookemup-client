var ModalMixin = function (body) {

	var modal = {};

	var vm =
	modal.vm = {
		init: function () {
			vm.show = m.prop(false);

			vm.open = function () {
				vm.show(true);
			};

			vm.close = function () {
				vm.show(false)
			};

			vm.body = body;
		}
	};

	function config(element, isInitialized) {
		if (vm.show() && !isInitialized) {
			$(element).modal('show');
		} else {
			isInitialized && $(element).modal('hide');
		}
	}


  vm.init();
	body.controller();


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
