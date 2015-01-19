/**
 * @jsx m
 */

var Editable = require('common/form-builder').inputs.editable;
var EditableSegment = require('profile/editable-segment');
var UserDetail = require('model/user-details');

var InterestsSegment = function (interests, canEdit, userID) {
	var segment = {};

	segment.controller = function () {
		this.vm.init();
	};

	segment.save = function() {
		UserDetail.putInterestsByID(userID, interests).then(function() {
			segment.vm.editing(false);
		});
	}

	function addInterest() {
		interests.push({title: m.prop(null), description: m.prop(null)});
		m.redraw(); // Otherwise x-editable gets angry and starts bugging out
	}

	segment.viewContent = function () {
		if (canEdit && segment.vm.editing()) {
			interestsList = interests.map(function(interest) {
				return (
					<div className="item">
						<div className="header"
							config={Editable(interest.title, {
								placeholder: 'Add a title',
								showbuttons: false,
								onblur: 'submit'
							})}>
							{interest.title()}
						</div>
						<div className="content"
							config={Editable(interest.description, {
							placeholder: 'Add a description',
							showbuttons: false,
							onblur: 'submit'
							})}>
							{interest.description()}
						</div>
					</div>
				);
			});
			interestsList.push(
				<div className="item">
					<a onclick={addInterest}>
						+ Add interest
					</a>
				</div>
			);
		} else {
			interestsList = interests.map(function(interest) {
				return (
					<div className="item">
						<div className="header">{interest.title()}</div>
						<div className="content">
							{interest.description()}
						</div>
					</div>
				);
			});
		}
		return <div className="ui list">{ interestsList }</div>;
	};

	_.extend(segment, new EditableSegment(segment, 'interests', interests, canEdit, userID));

	return segment;
};

module.exports = InterestsSegment;
