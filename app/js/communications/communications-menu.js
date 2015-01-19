var CommunicationsMenu = function () {
	var communicationsMenu = {};

	var vm = {
		tabs: m.prop([
			{ name: 'Requests', icon: 'share alternate square', color: 'teal' },
			{ name: 'Messages', icon: 'mail', color: 'red' }
		])
	};

	communicationsMenu.view = function () {

		var item = function (label, icon, color) {
			return [
				m('a', { class: color + ' item' }, [
					m('i', { class: icon + ' icon' }),
					label
				])
			];
		};

		return [
			m('div.ui.vertical.labeled.icon.menu', [
				vm.tabs().map(function (tab) {
					return item(tab.name, tab.icon, tab.color)
				})
			])
		]
	};

	return communicationsMenu;
};

module.exports = CommunicationsMenu;
