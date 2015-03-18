/**
 * @jsx m
 */

var FormBuilder = require('common/form-builder');
var EditableText = require('common/editable-text');
var User = require('model/user');
var UserDetails = require('model/user-details');

var LocalSearch = FormBuilder.inputs.localSearch;

var ProjectsSegment = function (projects, canEdit, userID) {
	var segment = {};

	var vm = {
		personInput: m.prop(''),
		editingIndex: m.prop(-1),
		errorMessages: m.prop([]),
		formState: {
			startDate: m.prop('-'),
			title: m.prop(''),
			organization: m.prop(''),
			description: m.prop(''),
			people: []
		}
	};

	function fillProjectForm(project) {
		vm.formState.title(project.title());
		vm.formState.organization(project.organization());
		vm.formState.description(project.description());
		vm.formState.startDate(project.startDate());
		vm.formState.people = project.people;
	}

	function startEditing (projectIndex) {
		if (vm.editingIndex() < 0) {
			fillProjectForm(projects[projectIndex]);
			vm.editingIndex(projectIndex);
		}
	}

	function saveProjectForm () {
		vm.errorMessages([]);

		// Ensure required fields are set
		if (!vm.formState.title().length) {
			vm.errorMessages().push('Title is required');
		}

		if (!vm.formState.description().length) {
			vm.errorMessages().push('Description is required');
		}

		if (vm.errorMessages().length) { return; }

		if (projects.length == vm.editingIndex()) {
			projects.push(UserDetails.ProjectModel({ people: []}));
		}
		var project = projects[vm.editingIndex()];
		project.title(vm.formState.title());
		project.organization(vm.formState.organization());
		project.description(vm.formState.description());
		project.people = vm.formState.people;
		project.startDate(vm.formState.startDate());

		UserDetails.putProjectsByID(userID, projects).then(function() {
			vm.editingIndex(-1);
		});
	}

	function addProject() {
		var newProject = UserDetails.ProjectModel({
			title: '',
			organization: '',
			description: '',
			people: [],
			startDate: ''
		});
		fillProjectForm(newProject);
		vm.editingIndex(projects.length);
	}

	function addCollaborator(possibleChoices) {
		var foundPerson = _.find(possibleChoices, function(person) {
			return person.getName() === vm.personInput();
		});

		if (!foundPerson) return;

		vm.formState.people.push(foundPerson);
		vm.personInput('');
	}

	function removeProject(projectIndex) {
		projects.splice(projectIndex, 1);
	}

	function removeCollaborator(collaboratorIndex) {
		vm.formState.people.splice(collaboratorIndex, 1);
	}

	function viewProject(project, config, projectIndex) {
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
									<img src={ person.getPicture() }></img>
									{ person.getName() }
								</a>
							);
						})
					}
					</div>
				</div>
			);
		}

		return (
			<div className="item">
				<div className="header">
					<h3>
						{project.title()}
						<a className="edit-pencil" onclick={startEditing.bind(this, projectIndex)}>
							<i className="write icon"></i>
						</a>
					</h3>
					{project.organization()}
				</div>
				<div className="content">
					<div>{project.description()}</div>
					{people}
				</div>
			</div>
		);
	}

	function viewProjectEditor(config) {
		var project = vm.formState;

		function collaboratorsSection() {
			var findCollaborator = (
				<div className="ui search dropdown" config={
					LocalSearch({
						source: config.connections.filter(function(user) { // O(N*M) to exclude already added but M is small
							return !_.find(project.people, function(person) {
								return person._id() === user._id();
							});
						})
						.map(function(user) {
								return { title: user.getName() };
						}),
						onSelect: function() {
							// Evil hack
							setTimeout(function() {
								vm.personInput($('input.prompt')[0].value);
								m.redraw();
							}, 100);
							return 'default';
						}
					})}>
					<div className="fluid ui action input small">
						<input
							className="prompt"
							type="text"
							placeholder="Who did you work with? (must be connected)"
							value={vm.personInput()}
						/>
						<div onclick={addCollaborator.bind(this, config.connections)}
							className="ui right primary button">
							Add
						</div>
					</div>
					<div className="results"></div>
				</div>
			);

			var peopleList = null;
			if (project.people.length) {
				peopleList = (
					project.people.map(function(person, personIndex) {
						return (
							<div className="ui image label">
								<img src={ person.getPicture() } />
								<a href={'/profile/' + person._id()}
									config={m.route}>
									{ person.getName() }
								</a>
								<i onclick={removeCollaborator.bind(this, personIndex)}
									className="delete icon">
								</i>
							</div>
						);
					})
				);
			}
			return <div>{findCollaborator} {peopleList}</div>;
		}

		var error = vm.errorMessages().length ?
			<div className="ui warning message">
				<div className="div header">Oops!</div>
				<ul>
					{
						vm.errorMessages().map(function (message) {
							return <li>{message}</li>;
						})
					}
				</ul>
			</div>
		: null;
		return (
			<div className="ui tertiary segment">
				{error}
				<div className="fluid ui input stacked-text-input">
					<b><input value={project.title()}
						onchange={m.withAttr('value', project.title)}
						placeholder="What were you? (e.g. JS/PHP Developer)"/></b>
				</div>
				<div className="fluid ui input stacked-text-input">
					<input value={project.organization()}
						onchange={m.withAttr('value', project.organization)}
						placeholder="Where was this? (e.g. Facebook or UT Austin)"/>
				</div>
				<div className="fluid ui input stacked-text-input">
					<textarea value={project.description()}
						onchange={m.withAttr('value', project.description)}
						rows="4"
						placeholder="Some interesting details (e.g. Refactored the professor's code)"/>
				</div>
				{collaboratorsSection()}
				<div className="ui divider"></div>
				<div className="ui fluid">
					<div className="ui small buttons">
						<div className="ui positive button"
							onclick={saveProjectForm}>Save</div>
						<div className="ui button"
							onclick={vm.editingIndex.bind(vm, -1)}>Cancel</div>
					</div>
					<div className="ui red right floated small button">
						Remove
					</div>
				</div>
			</div>
		);
	}

	segment.view = function(config) {
		return (
			<div className="ui segment">
				<div className="ui ribbon label theme-color-main">
					EXPERIENCE
				</div>
				<div className="ui content projects">
					{
						_.map(projects, function(project, index) {
							return (index == vm.editingIndex()) ?
								viewProjectEditor(config) :
								viewProject(project, config, index);
						}, this)
					}
					{ (vm.editingIndex() == projects.length) ? 
						viewProjectEditor(config)
						: null
					}
					{ vm.editingIndex() < 0 && canEdit ?
					<a className="edit-pencil" onclick={addProject}>
						+ Add experience
					</a> : null }
				</div>
			</div>
		);
	};
	return segment;
};

module.exports = ProjectsSegment;
