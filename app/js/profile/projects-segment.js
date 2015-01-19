/**
 * @jsx m
 */

var FormBuilder = require('common/form-builder');
var EditableSegment = require('profile/editable-segment');
var User = require('model/user');
var UserDetails = require('model/user-details');

var Editable = FormBuilder.inputs.editable;
var LocalSearch = FormBuilder.inputs.localSearch;

var ProjectsSegment = function (projects, canEdit, userID) {
	var segment = {};

	segment.save = function() {
		UserDetails.putProjectsByID(userID, projects).then(function() {
			segment.vm.editing(false);
		});
	};

	function addProject() {
		projects.push(UserDetails.ProjectModel({title: null, description: null, people: [], details: []}));
		m.redraw(); // Otherwise x-editable gets angry and starts bugging out
	}

	function addDetail(project) {
		project.details.push({title: m.prop(), description: m.prop()});
		m.redraw(true); // Otherwise x-editable gets angry and starts bugging out
	}

	function addCollaborator(projectIndex, possibleChoices) {
		var foundPerson = _.find(possibleChoices, function(person) {
			console.log('testing', User.getName(person), '=', segment.vm.personInput());
			return User.getName(person) === segment.vm.personInput();
		});

		if (!foundPerson) return;

		projects[projectIndex].people.push(foundPerson);
		segment.vm.personInput('');
		segment.vm.projectAddingUser(null);
		m.redraw();
	}

	function removeCollaborator(projectIndex, collaboratorIndex) {
		projects[projectIndex].people.splice(collaboratorIndex, 1);
		m.redraw();
	}

	segment.viewContent = function (config) {
		if (canEdit && segment.vm.editing()) {
			projectsList = projects.map(function(project, index) {
				var peopleList = null;
				if (project.people.length) {
					peopleList = (
						project.people.map(function(person, personIndex) {
							return (
								<div className="ui image label">
									<img src={User.getPicture(person)} />
									<a href={'/profile/' + person._id()}
										config={m.route}>
										{User.getName(person)}
									</a>
									<i onclick={removeCollaborator.bind(this, index, personIndex)}
										className="delete icon">
									</i>
								</div>
							);
						})
					);
				}
				var detailsPart = null;
				if (project.details.length) {
					detailsPart = project.details.map(function(detail) {
						return (
							<div className="item">
								<i className="right triangle icon"></i>
								<div className="content">
									<div className="header">{detail.title()}</div>
									<div className="description">{detail.description()}</div>
								</div>
							</div>
						);
					});
				}
				var peoplePart = (
					<div className="project-segment-people">
						<div className="mini-header">with</div>
						<div>
							{peopleList}
							<a onclick={function() {
								segment.vm.projectAddingUser(index);
								segment.vm.personInput('');
							}}>
								+ Add a collaborator
							</a>
						</div>
						<div className="hidden ui search dropdown" config={
							LocalSearch({
								source: config.connections
									.filter(function(user) { // O(N*M) to exclude already added but M is small
										return !_.find(project.people, function(person) {
											return person._id() === user._id();
										});
									}).map(function(user) {
										return {title: User.getName(user)};
								}),
								onSelect: function() {
									// Evil hack
									setTimeout(function() {
										segment.vm.personInput($('input.prompt')[0].value);
										m.redraw();
									}, 100);
									return 'default';
								}
							})}>
							<div className="fluid ui action input small">
								<input
									className="prompt"
									type="text"
									placeholder="Collaborator's Name"
									value={segment.vm.personInput()}
								/>
								<div onclick={addCollaborator.bind(this, index, config.connections)}
									className="ui right primary button">
									Add
								</div>
							</div>
							<div className="results"></div>
						</div>
					</div>
				);
				return (
					<div className="item first-level-item">
						<div className="header"
							config={Editable(project.title, {
								placeholder: 'Add a title',
								showbuttons: false,
								onblur: 'submit'
							})}>
							{project.title()}
						</div>
						<div className="content">
							<div
								config={Editable(project.description, {
								placeholder: 'Add a description',
								showbuttons: false,
								onblur: 'submit'
								})}>
								{project.description()}
							</div>
							<div className="list">
								{detailsPart}
								<div className="item">
									<a onclick={addDetail.bind(this, project)}>
										<i className="right triangle icon"></i>
										+ Add detail
									</a>
								</div>
							</div>
							{peoplePart}
						</div>
					</div>
				);
			});
			projectsList.push(
				<div className="item first-level-item">
					<a onclick={addProject}>
						+ Add project
					</a>
				</div>
			);
		} else {
			projectsList = projects.map(function(project) {
				var people = null;
				if (project.people.length) {
					people = (
						<div className="project-segment-people">
							<div className="mini-header">with</div>
							<div> {
								project.people.map(function(person) {
									return (
										<a href={'/profile/' + person._id()} 
											className="ui image label">
											<img src={User.getPicture(person)} />
											{User.getName(person)}
										</a>
									);
								})
							}
							</div>
						</div>
					);
				}
				var details = null;
				if (project.details.length) {
					details = project.details.map(function(detail) {
						return (
							<div className="item">
								<i className="right triangle icon"></i>
								<div className="content">
									<div className="header">{detail.title()}</div>
									<div className="description">{detail.description()}</div>
								</div>
							</div>
						);
					});
				}
				return (
					<div className="item first-level-item">
						<div className="header">{project.title()}</div>
						<div className="content">
							<div>{project.description()}</div>
							<div className="list">{details}</div>
							{people}
						</div>
					</div>
				);
			});
		}
		return <div className="ui list">{projectsList}</div>;
	};

	_.extend(segment, new EditableSegment(segment, 'projects', projects, canEdit, userID));

	segment.vm.personInput = m.prop('');
	segment.vm.projectAddingUser = m.prop();
	return segment;
};

module.exports = ProjectsSegment;
