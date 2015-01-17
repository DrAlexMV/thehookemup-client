var Footer = function () {
	var footer = {};

	var vm = {

	};

	footer.view = function () {
		return [
			m('div.ui.inverted.black.vertical.segment.footer', [
				m('div.footer.link.list', [
					m('div.item', 'test')
				])
			])
		];
	};

	return footer;
};

module.exports = Footer;