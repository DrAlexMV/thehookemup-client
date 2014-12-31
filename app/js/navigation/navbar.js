var Navbar = function () {
	var navbar = {};

	navbar.vm = {
		test: ''
	};

	navbar.view = function () {
		return [
			m('div.ui.fixed.inverted.menu', [
				m('a.item', "The Hook'Em Up"),
				m('div.right.item', [
					m('div.ui.icon.input', [
						m('input[type="text"]', { placeholder: 'Search' }),
						m('i.search.icon')
					])
				])
			])
		];
	};

	return navbar;
};

module.exports = Navbar;
