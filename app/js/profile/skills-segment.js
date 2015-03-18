/**
 * @jsx m
 */

var UserDetail = require('model/user-details');
var Tagger = require('common/ui-core/tagger');

var SkillsSegment = function (skills, canEdit, userID) {

	var skillsStrings = m.prop(skills.map(function(skillProp) {
		return skillProp();
	}));

	var segment = {};

	//TODO: do we want to limit the number of skills a user can have?
	var vm = {
		tagger: Tagger({ maxCount: 1000, entity:'skills', autocomplete: true }),
		isEditing: m.prop(false)
	};

	segment.controller = function () {
		this.vm.init();
	};

	segment.save = function () {
		skills = skillsStrings().map(function(skillString){
			return m.prop(skillString)
		});
		UserDetail.putSkillsByID(userID, skills).then(
			vm.isEditing.bind(this, false));
	};


	segment.view = function () {
		var editToggle = canEdit ? (
			<div className="fluid">
				<a className="edit-pencil" onclick={
					function () {
						vm.isEditing(true);
					}}>
					<i className="write icon"></i>Add or remove skills
				</a>
			</div>
			) : null;

		var saveControls;
		var skillsList;
		if (vm.isEditing()) {
			saveControls = (
				<div className="ui small buttons">
					<div className="ui positive button" onclick={segment.save}>
						Save
					</div>
					<div className="ui button" onclick={vm.isEditing.bind(this, false) }>
						Cancel
					</div>
				</div>
			);
			skillsList = vm.tagger.view({
				selectedTags: skillsStrings,
				placeholder: 'Enter a skill you have'
		});
		} else {
			skillsList = skills.length ? (
				<div className="ui segment skill-tags">
					{ skills.map(function (skill) {
							return <div className="ui label">{ skill() }</div>;
						})
					}
				</div>
				) : null;
		}

		return (
			<div className="ui segment user-details">
				{ editToggle }
				<div className="ui ribbon label theme-color-main">
					SKILLS
				</div>
				<div className="ui content base-content">
					{ skillsList }
					{ saveControls }
				</div>
			</div>
		);
	};

	return segment;
};

module.exports = SkillsSegment;
