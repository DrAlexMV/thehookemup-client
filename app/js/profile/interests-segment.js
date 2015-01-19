/**
 * @jsx m
 */

var EditableSegment = require('profile/editable-segment');
var EditableText = require('common/editable-text');
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

	segment.onRevert = function() {
		segment.vm.editables = interests.map(buildInterestEditor);
	};

	function buildInterestEditor(interest)  {
		return {
			title: EditableText.buildConfig(interest.title),
			description: EditableText.buildConfig(interest.description)
		};
	}

	function addInterest() {
		var interest = {title: m.prop('Add a title'), description: m.prop('Add a description')};
		interests.push(interest);
		segment.vm.editables.push(buildInterestEditor(interest));
	}

	function removeInterest(index) {
		interests.splice(index, 1);
		segment.vm.editables.splice(index, 1);
	}

	segment.viewContent = function () {
		if (canEdit && segment.vm.editing()) {
			interestsList = interests.map(function(interest, index) {
				return (
					<div className="item editable-item">
						<div className="editables">
							<div className="header">
								{EditableText.view(segment.vm.editables[index].title)}
							</div>
							<div className="content">
								{EditableText.view(segment.vm.editables[index].description)}
							</div>
						</div>
						<div className="item-remove">
							<i onclick={removeInterest.bind(this, index)} className="delete icon"></i>
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

	segment.vm.editables = interests.map(buildInterestEditor);

	return segment;
};

module.exports = InterestsSegment;
