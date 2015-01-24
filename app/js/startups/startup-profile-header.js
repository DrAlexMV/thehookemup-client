var EditableImage = require('common/editable-image');
var FormBuilder = require('common/form-builder');
var StreamCommon = require('common/stream-common');

var StartupProfileHeader = function (isEditable) {
	var startupProfileHeader = {};

	var availableHandles = {
		'blog' : { name: 'Blog', icon: 'feed' },
		'twitter': { name: 'Twitter', icon: 'twitter' }
	};

	startupProfileHeader.stream = new Bacon.Bus();

	var vm =
	startupProfileHeader.vm = {
		profilePicture: new EditableImage(),
		isEditing: m.prop(false),
		categoryName: m.prop(''),
		headerForm: {
			name: m.prop(''),
			website: m.prop(''),
			description: m.prop(''),
			categories: [],
			handles: _.mapValues(availableHandles, function(value, key) { // Key by type
				return {type: key, url: m.prop('')};
			})
		}
	};

	var addCategory = function () {
		var s = vm.categoryName();
		if (!s || _.find(vm.headerForm.categories, function(entry) { return entry === s; })) {
			return;
		}
		vm.headerForm.categories.push(s);
		vm.categoryName('');
	};

	var deleteCategory = function (index) {
		vm.headerForm.categories.splice(index, 1);
	};

	var fillForm = function (startupBasic) {
		vm.headerForm.name(startupBasic.name());
		vm.headerForm.description(startupBasic.description());
		vm.headerForm.website(startupBasic.website());
		startupBasic.handles().forEach(function(handle) {
			vm.headerForm.handles[handle.type].url(handle.url)
		});
		vm.headerForm.categories = startupBasic.categories().slice();
	};

	var saveForm = function () {
		var vals = vm.headerForm;
		startupProfileHeader.stream.push(
			new StreamCommon.Message(
				'StartupProfileHeader::Update',
				{
					name: vals.name(),
					website: vals.website(),
					description: vals.description(),
					categories: vals.categories.slice(),
					handles: _.values(vals.handles).map(function(handle) {
						return {type: handle.type, url: handle.url()};
					})
				})
		);
		vm.isEditing(false);
	};

	startupProfileHeader.view = function (props) {
		startupBasic = props.startupBasic;

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
				return [
					startupBasic.handles().map(function (handle) {
						var handleInfo = availableHandles[handle.type];
						return m('a', {href: handle.url}, m('i.icon', { class: handleInfo.icon }));
					})
				];
			};

			var handlesEdit = function () {
				return [
					_.values(vm.headerForm.handles).map(function (handle) {
						var info = availableHandles[handle.type];
						var parameters = {
							name: handle.type,
							placeholder: '',
							value: handle.url(),
							class: 'stacked-text-input',
							onchange: m.withAttr('value', handle.url)
						};
						return m('div.fluid.ui.input', [FormBuilder.inputs.formField(parameters, info.name)]);
					})
				];
			};

		var middleSectionEditing = function() {
			var fields = {
				name: {
					name: 'name',
					placeholder: 'Startup Name',
					value: vm.headerForm.name(),
					onchange: m.withAttr('value', vm.headerForm.name)
				},
				description: {
					name: 'description',
					placeholder: 'Enter a description',
					value: vm.headerForm.description(),
					class: 'stacked-text-input',
					onchange: m.withAttr('value', vm.headerForm.description),
					rows: 4
				},
				website: {
					name: 'website',
					placeholder: 'Enter a URL',
					value: vm.headerForm.website(),
					class: 'stacked-text-input',
					onchange: m.withAttr('value', vm.headerForm.website),
				}
			};

			return [
				m('div.ui.header', [
					FormBuilder.inputs.formField(fields.name)
				]),
				m('div.ui.content', [
					m('div.ui.two.column.stackable.grid', [
						m('div.column', [
							m('div.fluid.ui.input', [
								FormBuilder.inputs.formField(fields.website, 'Website')
							]),
							m('div.fluid.ui.input', [
								FormBuilder.inputs.formField(fields.description, 'Description', '', 'textarea')
							]),
							m('div.fluid.ui.action.small.input.focus', [
								m('input', {
									placeholder: 'Add a category',
									value: vm.categoryName(),
									onchange: m.withAttr('value', vm.categoryName)
								}),
								m('div.ui.right.primary.button', { onclick: addCategory }, ['Add'])
							]),
							vm.headerForm.categories.length ?
								m('div.ui.segment', [
									m('div.header', ['Categories']),
									m('div.ui.two.column.stackable.grid', [
										m('div.column', [
											m('div', [
												vm.headerForm.categories.map(function(category, index) {
													return m('div.ui.label', [
														category,
														m('i.delete.icon', { onclick: deleteCategory.bind(this, index) })
													]);
												})
											])
										]),
										m('div.right.aligned.column', [
											m('div.ui', [
											])
										])
									])
								]) : null
						]),
						m('div.column', [
							handlesEdit()
						])
					])
				]),
				m('div.ui.hidden.divider'),
				m('div.ui.small.buttons', [
					m('div.ui.positive.button', {onclick: saveForm}, 'Save'),
					m('div.ui.button', { onclick:  vm.isEditing.bind(this, false) }, 'Cancel')
				])
			];
		};

		var middleSection = function() {
				return [
					m('div.ui.header', [
						startupBasic.name(),
						props.editable ?
							m('a.startup-header-edit', {
								onclick: function() {
									fillForm(startupBasic);
									vm.isEditing(true);
								}}, [
									m('i.write.icon')
								]
							) : null
					]),
					m('div.meta', [
						startupBasic.website() ? m('a', {href: startupBasic.website()}, startupBasic.website()) : null,
						m('div', startupBasic.description())
					]),
					m('div.ui.two.column.stackable.grid', [
						m('div.column', [
							m('div', [
								startupBasic.categories().map(function(category) {
									return m('div.ui.label', category);
								})
							])
						]),
						m('div.right.aligned.column', [
							m('div.ui', [
								m('div.ui.button', 'Hello')
							])
						])
					])
				];
			};

			return [
				m('div#startup-description', [
					m('div.ui.attached.segment', [
						m('div.ui.content', [
							m('div.ui.stackable.grid', [
								m('div.three.wide.center.aligned.column', [
									startupProfileHeader.vm.profilePicture.view({
										editable: props.editable,
										userImageURL: startupBasic.picture(),
										imageClasses: 'startup-logo'
									})
								]),
								m('div.thirteen.wide.column', [
									vm.isEditing()  ? middleSectionEditing() : middleSection()
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
								vm.isEditing()  ? null : handles()
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
