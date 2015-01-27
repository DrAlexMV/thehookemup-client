/**
 * @jsx m
 */

var EditableText = require('common/editable-text');
var StreamCommon = require('common/stream-common');

var StartupOverview = function () {
	var startupOverview = {};

	var saveCallback = function(newVal) {
		startupOverview.stream.push(new StreamCommon.Message(
			'StartupOverview::Update',
			{ overview: newVal }
		));
	};

	var vm = {
		descriptionEditable: EditableText.buildConfig(
			m.prop(),
			'Tell us what your company does and what sets you apart.',
			saveCallback
		)
	};

	vm.descriptionEditable.type = 'textarea';

	startupOverview.stream = new Bacon.Bus();

	startupOverview.view = function (props) {
		vm.descriptionEditable.prop(props.overview);
		return (
			<div className="ui segment">
				<div className="ui header">
					Overview
				</div>
				<div className="ui divider"></div>
				{ EditableText.view(vm.descriptionEditable) }
			</div>
		);
	};

	return startupOverview;
};

module.exports = StartupOverview;