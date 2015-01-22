var Context = require('common/context');

var FollowButton = function () {
	var followButton = {};

	var vm = {
		following: m.prop(false),
		waitingForResponse: m.prop(false),
		follow: function (idToFollow) {
		}
	};

	followButton.view = function (idToFollow) {

		var buttonView = function (following, loading, clickAction) {
			return [
				m('div.ui.labeled.icon.button', { class: loading ? 'loading' : '', onclick: clickAction } , [
					m('i.thumbs.up.icon'),
					following ? 'Following' : 'Follow'
				])
			]
		};

		return [
			buttonView(vm.following(), vm.waitingForResponse(), vm.follow.bind(this, idToFollow))
		];
	};

	return followButton;
};

modules.export = FollowButton;