/**
 *
 * @jsx m
 */

var FormBuilder = require('common/form-builder');
var StreamCommon = require('common/stream-common');

var SearchFilterForm = function (parameters) {
	var searchFilterForm = {};

	var vm =
	searchFilterForm.vm = {
		firstName: m.prop(parameters.firstName),
		lastName: m.prop(parameters.lastName),
		role: m.prop(parameters.role),
		skills: m.prop(parameters.details)
	};

	searchFilterForm.stream = new Bacon.Bus();

	function search() {
		searchFilterForm.stream.push(new StreamCommon.Message('SearchFilterForm::Search', {
			firstName: vm.firstName(),
			lastName: vm.lastName(),
			role: vm.role(),
			details: vm.skills() // Search details for skills.
		}));
	}

	searchFilterForm.view = function () {

		var searchFields = [
			{
				parameters: {
					name: 'skills',
					placeholder: 'Skills',
					onchange: m.withAttr('value', vm.skills),
					value: vm.skills()
				}
			},
			{
				parameters: {
					name: 'role',
					placeholder: 'Role',
					onchange: m.withAttr('value', vm.role),
					value: vm.role()
				}
			},
			{
				parameters: {
					name: 'first-name',
					placeholder: 'First Name',
					onchange: m.withAttr('value', vm.firstName),
					value: vm.firstName()
				}
			},
			{
				parameters: {
					name: 'last-name',
					placeholder: 'Last Name',
					onchange: m.withAttr('value', vm.lastName),
					value: vm.lastName()
				}
			}
		];

		return (
			<form className="ui form">
				{
					searchFields.map(function (field) {
						return FormBuilder.inputs.formField(field.parameters);
					})
				}
				<div className="ui right floated buttons">
					<div className="ui blue button" onclick={search}>Search</div>
				</div>
			</form>
		);
	};

	return searchFilterForm;
};

module.exports = SearchFilterForm;
