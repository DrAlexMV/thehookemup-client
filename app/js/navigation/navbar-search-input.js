var StreamCommon = require('common/stream-common');

var NavbarSearchInput = function (parameters) {
	var searchInput = {},
		ENTER_KEY = require('common/constants').ENTER_KEY,
		defaultParameters =  {
			minCharacters: 3,
			delay: 1000
		};

	parameters = _.extend(defaultParameters, parameters);

	searchInput.stream = new Bacon.Bus();

	var vm =
		searchInput.vm = {
			searchQuery: m.prop(''),

			search: function () {
				if (vm.searchQuery().length >= parameters.minCharacters) {
					searchInput.stream.push(new StreamCommon.Message('SearchInput::Search',
						{ query_string: vm.searchQuery() }));
				}
			}
		};

	var keyHandlers = {
		13: function () {
			vm.search();
		}
	};

	function keyup(e) {
		if (keyHandlers[e.keyCode]) {
			keyHandlers[e.keyCode]();
		} else {
			m.redraw.strategy('none');
		}
	}

	searchInput.view = function () {
		return m('div.ui.action.input', [
			m('input[type="text"]', { placeholder: 'Search', onkeyup: keyup,
				onchange: m.withAttr('value', vm.searchQuery), value: vm.searchQuery() }),
			m('div.ui.icon.button', { onclick: vm.search }, [
				m('i.search.icon')
			])
		]);
	};

	return searchInput;
};

module.exports = NavbarSearchInput;
