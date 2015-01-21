var FollowCount = function () {
	var followCount = {};

	var vm = {
		followCount: m.prop(0)
	};

	followCount.view = function (count) {
		vm.followCount(count ? count : 0);

		return [
			m('div', [
				m('i.thumbs.up.icon'),
				vm.followCount()
			])
		];
	};

	return followCount;
};

module.exports = FollowCount;