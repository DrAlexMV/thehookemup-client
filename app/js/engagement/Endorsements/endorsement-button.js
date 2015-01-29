var Context = require('common/context');
var Endorsements = require('model/endorsements')();

var EndorseButton = function (entityId, entityType) {
	var endorseButton = {};

	var vm = {
		endorsing: m.prop(false),
		waitingForResponse: m.prop(false),
		endorse: function () {
			vm.waitingForResponse(true);
			Endorsements.endorseEntity(entityId, entityType)
				.then(vm.endorsing.bind(this, true))
				.then(vm.waitingForResponse.bind(this, false));
		},
		removeEndorsement: function () {
			vm.waitingForResponse(true);
			Endorsements.removeEndorsement(entityId)
				.then(vm.endorsing.bind(this, false))
				.then(vm.waitingForResponse.bind(this, false))
		},
		init: function () {
			Endorsements.hasUserEndorsedEntity(entityId)
				.then(_.compose(vm.endorsing, function (response) { return response.hasEndorsed }));
		}
	};

	endorseButton.view = function () {

		var buttonView = function (endorseing, loading, clickAction) {
			return [
				m('div.ui.labeled.icon.button', { class: loading ? 'loading' : '', onclick: clickAction } , [
					m('i.thumbs.up.icon'),
					endorseing ? 'Endorsing' : 'Endorse'
				])
			]
		};

		return [
			buttonView(vm.endorsing(), vm.waitingForResponse(),
				vm.endorsing() ? vm.removeEndorsement : vm.endorse)
		];
	};

	vm.init();
	return endorseButton;
};

module.exports = EndorseButton;