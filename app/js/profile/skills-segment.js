/**
 * @jsx m
 */

var EditableSegment = require('profile/editable-segment');
var UserDetail = require('model/user-details');
var Tagger = require('common/ui-core/tagger');

var SkillsSegment = function (skills, canEdit, userID) {

	var skillsStrings = m.prop(skills.map(function(skillProp) {
		return skillProp();
	}));

	var segment = {};

	segment.controller = function () {
		this.vm.init();
	};

	segment.save = function () {
		skills=skillsStrings().map(function(skillString){
			return m.prop(skillString)
		});
		UserDetail.putSkillsByID(userID, skills).then(function () {
			segment.vm.editing(false);
		});
	};


	segment.viewContent = function () {
		if (canEdit && segment.vm.editing()) {

			return (
				segment.vm.skillsTypeaheadTagger.view({ selectedTags: skillsStrings, placeholder: "Add a skill"})
				)
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

	//TODO: do we want to limit the number of skills a user can have?
	segment.vm.skillsTypeaheadTagger = Tagger({ maxCount: 1000, entity:'skills', autocomplete: true});

	return segment;
};

module.exports = SkillsSegment;
