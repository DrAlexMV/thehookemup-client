var StartupProfileHeader = function () {
	var startupProfileHeader = {};

	startupProfileHeader.view = function () {
		var tabs = [
			{ name: 'Overview', icon: '' },
			{ name: 'Followers', icon: 'thumbs outline up' },
			{ name: 'Q&A', icon: 'comments outline' }
		];

		var companyDetails = function () {

			function handles() {
				var availableHandles = [
					{ name: 'Blog', icon: '' },
					{ name: 'Twitter', icon: '' }
				];
			}

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
					m('div#startup-handles.ui.bottom.attached.right.aligned.segment', [
						m('a', [
							m('i.twitter.icon')
						])
					])
				])
			];
		};

		return [
			m('div.ui.grid', [
				m('div.row', [
					m('div.three.wide.column', [
						m('img.ui.image', { src: '../img/image.png' }),
					]),
					m('div.thirteen.wide.column', [
						companyDetails()
					])
				])
			]),
			m('div', { style: 'margin-top: 10px' } , [
				m('div.ui.segment', [
					m('div.ui.secondary.pointing.menu', [
						tabs.map(function (tab) {
							return m('a.item', [
								m('i.icon', { class: tab.icon }),
								tab.name
							]);
						})
					])
				])
			])
		];
	};

	return startupProfileHeader;
};

module.exports = StartupProfileHeader;
