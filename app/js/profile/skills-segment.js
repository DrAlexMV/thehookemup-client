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
						<input
						id="edValue"
						type="text"
						placeholder="Add a skill"
						onkeypress={function() 
    						{
    							console.log("In on keydown")
						        var edValue = document.getElementById("edValue");
						        var s = edValue.value;
						    
						        console.log(s);
						        if(s!='') {
						    	var skills = segment.getSuggestions(
								{text:s,
								results:10}, 'skills',
								segment.vm.skillSuggestions).then(function (skills) {
									var output = document.getElementById("output");
						    		console.log("Skills are " + segment.vm.skillSuggestions());

						    		output.innerText = "The text box contains: "+segment.vm.skillSuggestions(); })

								}
						    	
						        //var s = $("#edValue").val();
						        //$("#lblValue").text(s);    
						    }
						}
						    onkeyup={function() 
    						{
    							console.log("in on keyup")
						        var edValue = document.getElementById("edValue");
						        var s = edValue.value;
						    
						        console.log(s);
						        if(s!='') {
						    	var skills = segment.getSuggestions(
								{text:s,
								results:10}, 'skills',
								segment.vm.skillSuggestions).then(function(skills) {
								var output = document.getElementById("output");
						    	console.log("Skills are " + segment.vm.skillSuggestions());

						    	output.innerText = "The text box contains: "+segment.vm.skillSuggestions(); }
						    	)


						    	

						        //var s = $("#edValue").val();
						        //$("#lblValue").text(s);    
						    }
						} }
							
							
							
								
						
					
						onchange={m.withAttr("value", segment.vm.skillInput)}
						
						/>
						<span
						id = "output">
						</span>
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
	_.mixin(segment, Typeahead);

	segment.vm.skillInput = m.prop('');
	segment.vm.skillSuggestions = m.prop('');
	return segment;
};

module.exports = SkillsSegment;
