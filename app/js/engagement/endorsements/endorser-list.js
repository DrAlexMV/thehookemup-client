var Endorsements = require('model/endorsements')();
var HorizontalEntityListSegment = require('dashboard/horizontal-entity-list-segment');
var User = require('model/user');

var EndorserList = function (entityId) {
	var endorserList = {};
	var vm = {
		endorsers: m.prop([]),
		init: function () {
			Endorsements.getEntityEndorsementUserEndorsers(entityId).then(function(response) {
				vm.endorsers(response.endorsers());
			});
		}
	};

	endorserList.getCount = function() {
		return vm.endorsers().length;
	};

	endorserList.view = function() {
		return HorizontalEntityListSegment(
			'',
			'/profile',
			function() {
				return vm.endorsers();
			},
			User,
			{}
		).view();
	}

	vm.init();
	return endorserList;
};

module.exports = EndorserList;
