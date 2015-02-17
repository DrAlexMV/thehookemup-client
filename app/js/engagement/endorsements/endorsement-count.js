var Endorsements = require('model/endorsements')();

var EndorsementCount = function (entityId, counts) {
	var endorsementCount = {};

	var vm = {
		awaitingCount: m.prop(false),
		endorserCount: m.prop(),
		getCount: function (entityId) {
			vm.awaitingCount(true);
			var extractEndorsers = function (endorsements) { return endorsements.endorsers; };

			return Endorsements.getEntityEndorsementCount(entityId)
				.then(_.compose(vm.endorserCount, extractEndorsers))
				.then(vm.awaitingCount.bind(this, false));
		},
		init: function () {
			if (counts) { vm.endorserCount(counts().endorsers); }
			else { vm.getCount(entityId); }
		}
	};


	endorsementCount.view = function () {
		function count() {
			return  [
				m('i.thumbs.up.icon'), vm.endorserCount()
			];
		}

		function loader() { return m('div.loader', { class: vm.awaitingCount() ? 'active' : '' }) }

		return [
			m('div.ui.label', [
				loader(),
				count()
			])
		];
	};

	vm.init();
	return endorsementCount;
};

module.exports = EndorsementCount;