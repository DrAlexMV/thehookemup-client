var StartupProfileHeader = function () {
	var startupProfileHeader = {};

	startupProfileHeader.view = function () {
		var tabs = function () {
			var availableTabs = [
				{ name: 'Overview', icon: '' },
				{ name: 'Followers', icon: 'thumbs outline up' },
				{ name: 'Q&A', icon: 'comments outline' }
			];

			return [
				m('div', [
					m('div.ui.secondary.pointing.menu', [
						availableTabs.map(function (tab) {
							return m('a.item', [
								m('i.icon', { class: tab.icon }),
								tab.name
							]);
						})
					])
				])
			];
		};

		var companyDetails = function () {

			var handles = function () {
				var availableHandles = [
					{ name: 'Blog', icon: '' },
					{ name: 'Twitter', icon: 'twitter' }
				];

				return [
					handles.map(function (handle) {
						return m('a', m('i.icon', { class: handle.icon }));
					})
				];
			};

			return [
				m('div#startup-description', [
					m('div.ui.attached.segment', [
						m('div.ui.content', [
							m('div.ui.header', [
								'Startup Name'
							]),
							m('div.meta', [
								'Conquering the world'
							]),
							m('div.ui.two.column.stackable.grid', [
								m('div.column', [
									m('div', [
										m('div.ui.label', 'User Research'),
										m('div.ui.label', 'Marketing'),
									])
								]),
								m('div.column', [
									m('div.ui.right.floated', [
										m('div.ui.button', 'Hello')
									])
								])
							])
						])
					]),
					m('div#startup-handles.ui.bottom.attached.left.aligned.segment', [
						tabs(),
					])
				])
			];
		};

		return [
			m('div.ui.grid', [
				m('div.row', [
//					m('div.three.wide.column', [
//						m('img.ui.image', { src: '../img/image.png' }),
//					]),
					m('div.sixteen.wide.column', [
						companyDetails()
					])
				])
			])
		];
	};

	return startupProfileHeader;
};

module.exports = StartupProfileHeader;
