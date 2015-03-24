var StreamCommon = require('common/stream-common');

var CommunicationsMenu = function () {
	var communicationsMenu = {};

	var vm = {
		tabs: m.prop([
			{ name: 'Requests', icon: 'share alternate square', color: 'teal' },
		])
	};

  communicationsMenu.stream = new Bacon.Bus();

  var respond = function(whichButton) {
       console.log('in respond');
      communicationsMenu.stream.push(new StreamCommon.Message('CommunicationsMenu::Tab', {tab: whichButton}));
  };

	communicationsMenu.view = function () {

		var item = function (label, icon, color) {
			return [
				m('a', { class: color + ' item' }, [
					m('i', { class: icon + ' icon', onclick: respond.bind(respond, label) }),
					label
				])
			];
		};

		return [
			m('div.ui.veritical.labeled.icon.menu', [
				vm.tabs().map(function (tab) {
					return item(tab.name, tab.icon, tab.color)
				})
			])
		]
	};

	return communicationsMenu;
};

module.exports = CommunicationsMenu;
