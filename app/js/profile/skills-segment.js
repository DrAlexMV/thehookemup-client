/**
 * @jsx m
 */

var EditableSegment = require('profile/editable-segment');
var UserDetail = require('model/user-details');
var Typeahead = require('common/ui-core/typeahead');

var SkillsSegment = function (skills, canEdit, userID) {
	var segment = {};

	segment.controller = function () {
		this.vm.init();
	};

	segment.save = function () {
		UserDetail.putSkillsByID(userID, skills).then(function () {
			segment.vm.editing(false);
		});
	};

	function addSkill() {
		//TODO: How to not rely on clearing the value this way?
		document.getElementById("inputValue").value = '';
		var s = m.prop(segment.vm.skillInput());
		if (!s() || _.find(skills, function (entry) {
			return entry() === s();
		})) {
			return;
		}
		skills.push(s);
		segment.vm.skillInput('');

	}

	function deleteSkill(index) {
		return function () {
			skills.splice(index, 1);
			m.redraw();
		}
	}

	segment.viewContent = function () {
		if (canEdit && segment.vm.editing()) {
			var skillList = null;
			if (skills.length) {
				skillsList = (
					<div className="ui segment skill-tags"> {
						skills.map(function (skill, index) {
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
						<div className = "ui grid">
							<div className = "fourteen wide column" style="padding-right: 0px">
							{segment.vm.typeahead.view()}
							</div>
							<div className = "two wide column" style="padding-left: 0px">

								<div className="ui right primary button" onclick={addSkill}>


								Add
								</div>

							</div>
						</div>
					</div>
					{ skillsList }
				</div>
				);
		} else {
			var skillsList = null;
			if (skills.length) {
				skillsList = (
					<div className="ui segment skill-tags"> {
						skills.map(function (skill) {
							return <div className="ui label">{ skill() }</div>;
						})
						}
					</div>
					);
			}
			return (
				<div className="ui content base-content">
					{ skillsList }
				</div>
				);
		}
	};

	_.extend(segment, new EditableSegment(segment, 'skills', skills, canEdit, userID));

	segment.vm.skillInput = m.prop('');
	segment.vm.typeahead = Typeahead('skills', segment.vm.skillInput, 'Add a skill', 5);

	return segment;
};

module.exports = SkillsSegment;
