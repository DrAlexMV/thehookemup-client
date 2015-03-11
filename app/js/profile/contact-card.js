var EditableImage = require('common/editable-image');
var FormBuilder = require('common/form-builder');
var userRoles = require('common/constants').availableRoles;
var userHandles = require('common/constants').userHandles;
var User = require('model/user');

//TODO: Need website and angel list icons
var ContactCard = function (basicUserInfo, editable) {
	var card = {};

	var findWebsiteUrl = function (websiteName) {
		var handle = _.find(basicUserInfo().handles(), function (entry) {
			return (entry.type == websiteName);
		});
		return handle ? handle.url : '';
	};

	card.save = function () {
		User.putByID('me', {roles: vm.roles(),
			handles: _.values(userHandles).map(function (handle) {
				return {'type': handle.type, url: handle.url() }
			})}).then(function () {
				vm.editing(false);
			}
		);
	};

	var vm = card.vm = {
		profilePicture: new EditableImage(),
		editing: m.prop(false),
		roles: m.prop(basicUserInfo().roles())
	};

	_.forEach(userHandles, function (handle) {
		handle.url(findWebsiteUrl(handle.type))
	});
	card.view = function () {


		var editButton = editable ?
			vm.editing() ? [
				m('div', [
					m('div.mini.ui.buttons', [
						m('div.ui.blue.button', {onclick: card.save.bind(this)}, 'Save'),
						m('div.ui.red.button', {onclick: vm.editing.bind(this, false)}, 'Discard')
					]),
					m('div.ui.hidden.divider')

				])] : [
				m('div', [
					m('div.mini.ui.blue.button', {onclick: vm.editing.bind(this, true)}, [
						'Edit'
					]),
					m('div.ui.hidden.divider')
				])
			] : null;

		var rolesEdit = function () {
			return userRoles.map(function (role) {
				var checked = basicUserInfo().roles().indexOf(role) > -1 ? 'checked' : null;
				return m('div.field', [FormBuilder.inputs.checkbox(role, {checked: checked, onchange: function () {
					var index = vm.roles().indexOf(role);
					(index > -1) ? vm.roles().splice(index, index + 1) : vm.roles().push(role)
				}})])
			})
		};

		var handlesEdit = function () {
			return [
				_.values(userHandles).map(function (handle) {
					(handle);
					var parameters = {
						name: handle.name,
						placeholder: '',
						value: handle.url(),
						class: 'stacked-text-input',
						onchange: m.withAttr('value', handle.url)
					};
					return m('div.fluid.ui.input', [FormBuilder.inputs.formField(parameters, handle.name)]);
				})
			];
		};

		var handlesView = _.map(userHandles, function (handle) {
			return handle.url() ? [
				m("a.[href=" + handle.url() + "]", [
					m('div.ui.circular.' + handle.icon + '.icon.button', [
						m('i.' + handle.icon + '.icon')
					])
				])
			] : null;
		});

		return [
			m('div.ui.card', [
				card.vm.profilePicture.view({
					editable: editable,
					userImageURL: basicUserInfo().picture()
				}),
				m('div.content', [
					m('div.ui.header', basicUserInfo().roles().join(', ')),
					m('div.ui.divider'),
					handlesView
				]),

				m('div.content', [
					editButton,
					vm.editing() ? [rolesEdit(), handlesEdit()] : null
				])
			])
		]
	};

	return card;
};

module.exports = ContactCard;
