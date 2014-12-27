var auth = {};

auth.controller = function () {
};

auth.view = function () {
	return m("html", [
		m("body", [
			m('div.ui.page.grid', [
				m('div.six.wide.column', [
					m('div.ui.piled.segment#auth-segment', [])
				])
			])
		])
	]);
};

m.module(document, { controller: auth.controller, view: auth.view });
