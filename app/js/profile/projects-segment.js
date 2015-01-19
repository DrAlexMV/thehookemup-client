/**
 * @jsx m
 */

var FormBuilder = require('common/form-builder');
var EditableText = require('common/editable-text');
var EditableSegment = require('profile/editable-segment');
var User = require('model/user');
var UserDetails = require('model/user-details');

var LocalSearch = FormBuilder.inputs.localSearch;

var ProjectsSegment = function (projects, canEdit, userID) {
	var segment = {};

	segment.save = function() {
		UserDetails.putProjectsByID(userID, projects).then(function() {
			segment.vm.editing(false);
		});
	};

	segment.onRevert = function() {
		segment.vm.editables = projects.map(buildProjectEditor);
	};

	function addProject() {
		var newProject = UserDetails.ProjectModel({
			title: 'Add Project Title',
			description: 'Add project description.',
			people: [],
			details: [],
			date: ''
		});
		projects.push(newProject);
		segment.vm.editables.push(buildProjectEditor(newProject));
	}

	function addDetail(projectIndex) {
		var newDetail = {title: m.prop('Add Title'), description: m.prop('Add description.')};
		projects[projectIndex].details.push(newDetail);
		segment.vm.editables[projectIndex].details.push(buildProjectDetailEditor(newDetail));
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

	function removeProject(projectIndex) {
		projects.splice(projectIndex, 1);
		segment.vm.editables.splice(projectIndex, 1);
	}

	function removeDetail(projectIndex, detailIndex) {
		projects[projectIndex].details.splice(detailIndex, 1);
		segment.vm.editables[projectIndex].details.splice(detailIndex, 1);
	}

	function buildProjectDetailEditor(projectDetail) {
		return {
			title: EditableText.buildConfig(projectDetail.title),
			description: EditableText.buildConfig(projectDetail.description)
		};
	}

	function buildProjectEditor(project) {
		return {
			title: EditableText.buildConfig(project.title),
			description: EditableText.buildConfig(project.description),
			date: EditableText.buildConfig(project.date),
			details: project.details.map(buildProjectDetailEditor)
		};
	}

	function removeCollaborator(projectIndex, collaboratorIndex) {
		projects[projectIndex].people.splice(collaboratorIndex, 1);
		m.redraw();
	}

	function editableView(config) {
		var projectsList = projects.map(function(project, index) {
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
				detailsPart = project.details.map(function(detail, detailIndex) {
					return (
						<div className="item editable-item">
							<i className="right triangle icon"></i>
							<div className="content project-detail">
								<div className="editables">
									<div className="header">
										{EditableText.view(segment.vm.editables[index].details[detailIndex].title)}
									</div>
									<div className="description">
										{EditableText.view(segment.vm.editables[index].details[detailIndex].description)}
									</div>
								</div>
								<div className="item-remove">
									<i className="delete icon" onclick={removeDetail.bind(this, index, detailIndex)}></i>
								</div>
							</div>
						</div>
					);
				});
			}
			var addingCollab = segment.vm.projectAddingUser() === index;
			var peoplePart = (
				<div className="project-segment-people">
					<div className="mini-header">with</div>
					<div>
						{peopleList}
						{
							(addingCollab) ?
								<a onclick={function() {
									segment.vm.projectAddingUser(null);
									segment.vm.personInput('');
								}}>
									- Add a collaborator
								</a> :
								<a onclick={function() {
									segment.vm.projectAddingUser(index);
									segment.vm.personInput('');
								}}>
									+ Add a collaborator
								</a>
						}
					</div>
					{
						(addingCollab) ?
							<div className="ui search dropdown" config={
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
							</div> : null
					}
				</div>
			);
			return (
				<div className="item first-level-item editable-item">
					<div className="editables">
						<h3 className="header">
							{EditableText.view(segment.vm.editables[index].title)}
						</h3>
						<div className="content">
							{EditableText.view(segment.vm.editables[index].description)}
							<div className="list">
								{detailsPart}
								<div className="item">
									<a onclick={addDetail.bind(this, index)}>
										<i className="right triangle icon"></i>
										+ Add detail
									</a>
								</div>
							</div>
							{peoplePart}
						</div>
					</div>
					<div className="item-remove">
						<i className="delete icon" onclick={removeProject.bind(this, index)}></i>
					</div>
				</div>
			);
		});

		return (
			<div className="ui list">
				{projectsList}
				<div className="item first-level-item">
					<a onclick={addProject}>
						+ Add project
					</a>
				</div>
			</div>
		);
	} 

	function regularView(config) {
		var projectsList = projects.map(function(project) {
			var people = null;
			if (project.people.length) {
				people = (
					<div className="project-segment-people">
						<div className="mini-header">with</div>
						<div> {
							project.people.map(function(person) {
								return (
									<a href={'/profile/' + person._id()} 
										config={m.route}
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
							<div className="content project-detail">
								<div className="header">{detail.title()}</div>
								<div className="description">{detail.description()}</div>
							</div>
						</div>
					);
				});
			}
			return (
				<div className="item first-level-item">
					<h3 className="header">{project.title()}</h3>
					{project.date() ? <div className="project-date">{project.date()}</div> : null}
					<div className="content">
						<div>{project.description()}</div>
						<div className="list">{details}</div>
						{people}
					</div>
				</div>
			);
		});

		return <div className="ui list">{projectsList}</div>;
	}

	segment.viewContent = function (config) {
		if (canEdit && segment.vm.editing()) {
			return editableView(config);
		}
		return regularView(config);
	};

	_.extend(segment, new EditableSegment(segment, 'projects', projects, canEdit, userID));

	if (canEdit) {
		segment.vm.personInput = m.prop('');
		segment.vm.projectAddingUser = m.prop();
		segment.vm.editables = projects.map(buildProjectEditor);
	}

	return segment;
};

module.exports = ProjectsSegment;
