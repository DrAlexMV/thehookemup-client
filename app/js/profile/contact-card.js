var EditableImage = require('common/editable-image');
var FormBuilder = require('common/form-builder');
var UserRoles = require('common/constants').availableRoles;
var UserHandles = require('common/constants').userHandles;
var User = require('model/user');
var HandleEditor = require('common/social-handles/handle-editor');
var HandleModel = require('model/handle').HandleModel;


var ContactCard = function (basicUserInfo, editable) {
	var card = {};

	card.save = function () {

		if (vm.roles().length == 0) {
			vm.errorMessage("You must select at least one role.");
			m.redraw.strategy("all");
			return;
		}


		User.putByID('me', {roles: vm.roles(),
			handles: vm.handles()
		}).then(function () {
			vm.editing(false);
		});
		//update the basicUserInfo so the changes will show immediately
		basicUserInfo().handles(vm.handles().map(function (handleModel) {
			return HandleModel({type: handleModel.type(), url: handleModel.url()});
		}));
		basicUserInfo().roles(vm.roles().map(function (role) {
			return role;
		}));
		vm.errorMessage("");
		m.redraw.strategy("all");
	};

	//The vm contains a copy of the basicUserInfo that is modified during editing
	//and reverted back to the basicUserInfo if the changes are discarded.
	var vm = card.vm = {
		errorMessage: m.prop(''),
		profilePicture: new EditableImage(),
		editing: m.prop(false),
		//We need to create a copy here. Using the same reference causes the editing to overwrite the state even if the
		// user decides to discard the changes.
		roles: m.prop(basicUserInfo().roles().map(function (role) {
			return role;
		})),
		handles: m.prop(basicUserInfo().handles().map(function (handleModel) {
			return HandleModel({type: handleModel.type(), url: handleModel.url()});
		}))
	};

	var revert = function () {
		vm.roles(basicUserInfo().roles().map(function (role) {
			return role;
		}));
		vm.handles(basicUserInfo().handles().map(function (handleModel) {
			return HandleModel({type: handleModel.type(), url: handleModel.url()});
		}));
		vm.editing(false);
	};

	card.contentEditor = function () {
		var rolesEdit = function () {
			return UserRoles.map(function (role) {
				var checked = vm.roles().indexOf(role) > -1 ? 'checked' : null;
				return m('div.field', [FormBuilder.inputs.checkbox(role, {checked: checked, onchange: function () {
					var index = vm.roles().indexOf(role);
					(index > -1) ? vm.roles().splice(index, index + 1) : vm.roles().push(role)
				}})])
			})
		};
		var handleEditor = HandleEditor();

		var handlesEdit = function () {
			return vm.handles().map(function (handleModel) {
				return m('div.stacked-text-input',
					handleEditor.view(handleModel, false));
			});
		};

		return [
			rolesEdit(),
			m('div.ui.divider'),
			'Profile Links',
			handlesEdit()
		];
	};

	card.contentViewer = function () {
		var handlesView = _.map(basicUserInfo().handles(), function (handleModel) {
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
			m('div.ui.header', basicUserInfo().roles().join(', ')),
			m('div.ui.divider'),
			handlesView
		];
	}

	card.view = function () {

		var editButton = editable ?
			vm.editing() ? [
				m('div', [
					m("div[style='color:red']",vm.errorMessage()),
					m('div.mini.ui.buttons', [
						m('div.ui.blue.button', {onclick: card.save.bind(this)}, 'Save'),
						m('div.ui.red.button', {onclick: revert}, 'Discard')
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


		return [
			m('div.ui.card', [
				card.vm.profilePicture.view({
					editable: editable,
					userImageURL: basicUserInfo().picture()
				}),
				m('div.content', [
					editButton,
					vm.editing() ? card.contentEditor() : card.contentViewer()
				])
			])
		]
	};

	return card;
};

module.exports = ContactCard;
