var Tagger = function (settings) {
	var tagger = {};

	var vm = {
		tagName: m.prop(''),
		selectedTags: m.prop([]),
		addTag: function (category) {
			var conditions = [
				!_.contains(vm.selectedTags(), category),
				!_.isNumber(settings.maxCount) || vm.selectedTags().length < settings.maxCount
			];

			if (_.all(conditions)) {
				category && vm.selectedTags().push(category);
				vm.tagName('');
			}
		},
		deleteTag: function (index) {
			vm.selectedTags().splice(index, 1);
		}
	};

	tagger.view = function () {
		return [
			m('div.fluid.ui.action.small.input.focus', [
				m('input', {
					placeholder: 'Add a category',
					value: vm.tagName(),
					onchange: m.withAttr('value', vm.tagName)
				}),
				m('div.ui.right.primary.button', { onclick: vm.addTag.bind(this, vm.tagName()) }, 'Add')
			]),
			vm.selectedTags().length ?
				m('div.ui.segment', [
					m('div.ui.stackable.grid', [
						m('div.column', [
							m('div', [
								vm.selectedTags().map(function(tag, index) {
									return m('div.ui.label', [
										tag,
										m('i.delete.icon', { onclick: vm.deleteTag.bind(this, index) })
									]);
								})
							])
						])
					])
				]) : null
		];
	};

	return tagger;
};

module.exports = Tagger;