var StartupProfileHeader = function () {
	var startupProfileHeader = {};

	startupProfileHeader.view = function () {
		var tabs = function () {
			var availableTabs = [
				{ name: 'Overview', icon: '' },
				{ name: 'Followers', icon: 'thumbs outline up' },
				{ name: 'Q&A', icon: 'comments outline' },
				{ name: 'Funding', icon: 'money' },
				{ name: 'Jobs', icon: 'suitcase' }
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
					{ name: 'Blog', icon: 'feed' },
					{ name: 'Twitter', icon: 'twitter' }
				];

				return [
					availableHandles.map(function (handle) {
						return m('a', m('i.icon', { class: handle.icon }));
					})
				];
			};

			return [
				m('div#startup-description', [
					m('div.ui.attached.segment', [
						m('div.ui.content', [
							m('div.ui.stackable.grid', [
								m('div.three.wide.center.aligned.column', [
									m('img#startup-logo.ui.small.image', { src: '../img/image.png' })
								]),
								m('div.thirteen.wide.column', [
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
												m('div.ui.label', 'Marketing')
											])
										]),
										m('div.right.aligned.column', [
											m('div.ui', [
												m('div.ui.button', 'Hello')
											])
										])
									])
								])
							])
						])
					]),
					m('div#startup-handles.ui.bottom.attached.left.aligned.segment', [
						m('div.ui.stackable.grid', [
							m('div.thirteen.wide.column', [
								tabs()
							]),
							m('div.three.wide.right.aligned.column', [
								handles()
							])
						])
					])
				])
			];
		};

		return [
			m('div.ui.grid', [
				m('div.row', [
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
