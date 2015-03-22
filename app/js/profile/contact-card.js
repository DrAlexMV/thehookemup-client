var EditableImage = require('common/editable-image');
var FormBuilder = require('common/form-builder');
var UserRoles = require('common/constants').availableRoles;
var UserHandles = require('common/constants').userHandles;
var User = require('model/user');
var HandleEditor = require('common/social-handles/handle-editor');


var ContactCard = function (basicUserInfo, editable) {
	var card = {};

	card.save = function () {
		User.putByID('me', {roles: vm.roles(),
			handles: vm.handles()
		}).then(function () {
				vm.editing(false);
			}
		);
	};

	var vm = card.vm = {
		profilePicture: new EditableImage(),
		editing: m.prop(false),
		roles: m.prop(basicUserInfo().roles()),
		handles: m.prop(basicUserInfo().handles())
	};


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
					m('div.mini.ui.blue.button.right.floated', {onclick: vm.editing.bind(this, true)}, [
						'Edit'
					]),
					m('div.ui.hidden.divider')
				])
			] : null;

		var rolesEdit = function () {
			return UserRoles.map(function (role) {
				var checked = basicUserInfo().roles().indexOf(role) > -1 ? 'checked' : null;
				return m('div.field', [FormBuilder.inputs.checkbox(role, {checked: checked, onchange: function () {
					var index = vm.roles().indexOf(role);
					(index > -1) ? vm.roles().splice(index, index + 1) : vm.roles().push(role)
				}})])
			})
		};
		var handleEditor = HandleEditor();

		var handlesEdit = function () {
			return vm.handles().map(function (handle) {
				return [ m('br'), m('br'), handleEditor.view(handle, false) ];
			});
		};

		var handlesView = _.map(vm.handles(), function (handleModel) {

			var userHandle = UserHandles[handleModel.type()];

			return handleModel.url() ? [
				m("a.[href=" + handleModel.url() + "]", [
					m('div.ui.circular.' + userHandle.icon + '.icon.button', [
						m('i.' + userHandle.icon + '.icon')
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
					editButton,
					m('div.ui.header', basicUserInfo().roles().join(', ')),
					m('div.ui.divider'),
					handlesView
				]),

				m('div.content', [
					vm.editing() ? [rolesEdit(), handlesEdit()] : null
				])
			])
		]
	};

	return card;
};

module.exports = ContactCard;
