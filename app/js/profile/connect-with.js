var modalMixin = require('common/modal-mixin.js');

var ConnectWith = function (body){

    connect = {}

   var vm = connect.vm = {
		init: function () {
            vm.modal = ModalMixin(body)

		}
	};

    connect.controller=function () {
	    var vm = vm.init();
	};
	connect.view = function (ctrl) {
	return [
			m('button', { onclick: function(e)
		    {
               ctrl.vm.modal.open()
			}
			}, "Click Here to Connect")]
	};

}

module.exports = ConnectWith;