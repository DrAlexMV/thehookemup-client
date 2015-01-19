/**
 * @jsx m
 */

var UserDetail = require('model/user-details');

var EditableSegment = function (child, segmentName, contentData, canEdit, userID) {
	var segment = {};

	segment.vm = {
		editing: m.prop(false),
		originalContent: m.prop()
	};

	function revert() {
		contentData.length = 0;
		Array.prototype.push.apply(contentData, segment.vm.originalContent());

		segment.vm.editing(false);
		segment.vm.originalContent(undefined);
	}

	function startEditing() {
		segment.vm.editing(true);
		segment.vm.originalContent(contentData.slice());
	}

	segment.view = function (config) {
		var sections = null;
		var editButton = null;
		if (canEdit) {
			if (segment.vm.editing()) {
				editButton = (
					<div className="mini ui buttons right floated">
						<div className="ui red button"
							onclick={revert}>
							Discard
						</div>
						<div className="ui blue button" onclick={child.save}>
							Save
						</div>
					</div>
				);
			} else {
				editButton = (
					<div className="mini ui blue button right floated"
						onclick={startEditing}>
						Edit
					</div>
				);
			}
		}

		return (
			<div className="ui segment">
				<div className="ui ribbon label">
					<h4 className="ui header">{segmentName.toUpperCase()}</h4>
				</div>
				{editButton}
				<div className="ui content">
					<div className="ui hidden divider"></div>
					{ child.viewContent(config) }
				</div>
			</div>
		);
	};

	return segment;
};

module.exports = EditableSegment;
