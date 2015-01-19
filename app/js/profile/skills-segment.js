/**
 * @jsx m
 */

var EditableSegment = require('profile/editable-segment');
var UserDetail = require('model/user-details');

var SkillsSegment = function (skills, canEdit, userID) {
	var segment = {};

	segment.controller = function () {
		this.vm.init();
	};

	segment.save = function() {
		UserDetail.putSkillsByID(userID, skills).then(function() {
			segment.vm.editing(false);
		});
	}

	function addSkill() {
		var s = m.prop(segment.vm.skillInput());
		if (_.find(skills, function(entry) { return entry === s; })) {
			return;
		}
		skills.push(s);
		segment.vm.skillInput('');
	}

	function deleteSkill(index) {
		return function() {
			skills.splice(index, 1);
			m.redraw();
		}
	}

	segment.viewContent = function () {
		if (canEdit && segment.vm.editing()) {
			var skillList = null;
			if (skills.length) {
				skillsList = (
					<div className="ui segment virtual-resume-segment"> {
						skills.map(function(skill, index) {
							return (
								<div className="ui label">
									{skill()}
									<i className="delete icon" onclick={deleteSkill(index)}></i>
								</div>
							);
						})
					}
					</div>
				);
			}
			return (
				<div className="ui content">
					<div className="fluid ui action input small focus">
						<input
							type="text"
							placeholder="Add a skill"
							onchange={m.withAttr("value", segment.vm.skillInput)}
							value={segment.vm.skillInput()}
						/>
						<div className="ui right primary button" onclick={addSkill}>
							Add
						</div>
					</div>
					{ skillsList }
				</div>
			);
		} else {
			var skillsList = null;
			if (skills.length) {
				skillsList = (
					<div className="ui segment virtual-resume-segment"> {
						skills.map(function(skill) {
							return <div className="ui label">{ skill() }</div>;
						})
					}
					</div>
				);
			}
			return (
				<div className="ui content">
					{ skillsList }
				</div>
			);
		}
	};

	_.extend(segment, new EditableSegment(segment, 'skills', skills, canEdit, userID));

	segment.vm.skillInput = m.prop('');
	return segment;
};

module.exports = SkillsSegment;
