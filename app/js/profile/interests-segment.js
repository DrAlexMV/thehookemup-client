/**
 * @jsx m
 */

var EditableText = require('common/editable-text');
var UserDetail = require('model/user-details');

var InterestsSegment = function (interests, canEdit, userID) {
	var segment = {};

	var vm = {
		editables: m.prop()
	}

	segment.controller = function () {
		this.vm.init();
	};

	segment.save = function() {
		UserDetail.putInterestsByID(userID, interests);
	};

	segment.onRevert = function() {
		vm.editables = interests.map(buildInterestEditor);
	};

	function buildInterestEditor(interest, placeholders)  {
		return {
			title: EditableText.buildConfig(
				interest.title,
				placeholders.title,
				segment.save),
			description: EditableText.buildConfig(
				interest.description,
				placeholders.description,
				segment.save)
		};
	}

	function addInterest() {
		var interest = {title: m.prop(''), description: m.prop('')};
		interests.push(interest);
		var interestEditor = buildInterestEditor(interest, {title: 'Add a title', description: 'Add a description'});
		vm.editables.push(interestEditor);
		interestEditor.title.isEditing = true;

	}

	function removeInterest(index) {
		interests.splice(index, 1);
		vm.editables.splice(index, 1);
	}

	segment.view = function () {
		if (canEdit) {
			interestsList = interests.map(function(interest, index) {
				return (
					<div className="item editable-item">
						<div className="editables">
							<div className="header">
								{EditableText.view(vm.editables[index].title)}
							</div>
							<div className="content">
								{EditableText.view(vm.editables[index].description)}
							</div>
						</div>
						<div className="item-remove">
							<i onclick={removeInterest.bind(this, index)} className="delete icon"></i>
						</div>
					</div>
				);
			});
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
		return (
			<div className="ui segment user-details">
				<div className="ui ribbon label theme-color-main">
					INTERESTS
				</div>
				<div className="ui content base-content">
					<div className="ui list">{ interestsList }</div>
					{ canEdit ? <a className="edit-pencil" onclick={addInterest}>
						+ Add an interest
					</a> : null }
				</div>
			</div>
		);
	};

	vm.editables = interests.map(buildInterestEditor);

	return segment;
};

module.exports = InterestsSegment;
