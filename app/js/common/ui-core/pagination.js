var Message = require('common/stream-common').Message;

var Pagination = function () {
	var pagination = {};

	pagination.stream = new Bacon.Bus();

	var vm = (function () {
		var vm = {};

		vm.maxPagesToDisplay = m.prop();
		vm.totalPages = m.prop();
		vm.currentPage = m.prop(0);

		var propagateSelection =  function () {
			pagination.stream.push(new Message('PageSelected::Pagination', { page: vm.currentPage() }));
		};

		function wrapSelect(action) {
			return function () {
				if (action.apply(this, arguments)) {
					propagateSelection();
				}
			};
		}

		vm.next = wrapSelect(function () {
			var success = false;

			if (success = vm.currentPage() + 1 <= vm.totalPages()) { vm.currentPage(vm.currentPage() + 1); }

			return success;

		});

		vm.previous = wrapSelect(function () {
			var success = false;

			if (success = vm.currentPage() - 1 >= 0) { vm.currentPage(vm.currentPage() - 1); }

			return success;
		});

		vm.pageSelected = wrapSelect(function (page) {
			vm.currentPage(page);
		});

		return vm;
	})();

	pagination.view = function (totalPages, maxPagesToDisplay) {

		vm.maxPagesToDisplay(maxPagesToDisplay ? maxPagesToDisplay : 6);
		vm.totalPages(totalPages);

		var range = (function () {
			var range = {};
			if (vm.totalPages() <= vm.maxPagesToDisplay()) {
				range = { first: 0, last: vm.totalPages() };
			} else {
				if (vm.currentPage() >= vm.maxPagesToDisplay()) {
					var last = vm.currentPage() + vm.maxPagesToDisplay();
					range = { first: vm.currentPage(), last: last < totalPages ? last : totalPages };
				} else {
					range = { first: 0, last: vm.maxPagesToDisplay() };
				}
			}

			return range;
		})();

		function pages() {
			return _.map(_.range(range.first, range.last), function (page) {
				return m('a.item', {
					class: vm.currentPage() === page ? 'active' : '',
					onclick: vm.pageSelected.bind(this, page)
				}, page + 1);
			});
		}
		console.log(vm.currentPage() + 1);

		return [
			m('div.ui.borderless.pagination.menu', [
				m('a.item', { onclick: vm.previous }, [
					m('i.left.arrow.icon')
				]),
				pages(),
				m('a.item', { onclick: vm.next }, [
					m('i.right.arrow.icon')
				])
			])
		];
	};

	return pagination;
};

module.exports = Pagination;