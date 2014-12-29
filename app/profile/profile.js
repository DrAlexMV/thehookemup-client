/**
 * Provides profile page
 * @jsx m
 */

var profile = {};

profile.vm = {
	init: function () {
		// Mock immutable user data. TODO: pull from server.
		this.basicInfo = {
			name: 'Nicholas Sundin',
			graduation_year: 2016,
			major: 'B.S. Computer Science',
			description: 'Hacker who likes to burn the midnight oil as he discovers and tries out new ideas and technologies.',
			university: 'University of Texas',
		};

		/*
		 * Details could be a recursive structure, but explicitly limiting to
		 * two levels of detail to avoid possible buffer-overflow and
		 * design-overflow issues.
		 */
		this.details = [
			{
				title: 'skills',
				content: 
				[
					{
						title: 'Programming',
						description: 'Over a decade of experience',
						subpoints: [
							{
								title: 'Python',
								description: '10 years of network, threaded, graphic programming',
							},
							{
								title: 'C++',
								description: '6 years. OpenGL, wxWidgets',
							},
						],
					},
					{
						title: 'Eating Food',
						description: '20 years \'o this'
					},
				],
			},
			{
				title: 'interests',
				content: [
					{
						title: 'Repurposing consumer technology',
						description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
						subpoints: [
							{
								title: 'Banana Phone',
								description: 'Hack made with 2/3rds of an iPhone 8 and an overly-ripe banana',
							},
						],
					},
				],
			},
			{
				title: 'projects',
				content: [
					{
						title: 'Hook \'em up',
						description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
					},
				],
			},
		];

		this.edges = {
			connections: [2, 3, 4, 5],
			associations: [6, 7],
		};

		this.connections = new profile.EntityList('Connections', this.edges.connections);


	}
};

profile.controller = function () {
	profile.vm.init();
};

profile.view = function () {
	var vm = profile.vm;
	var contact_card = new profile.ContactCard('/img/self-small.jpg', {});

	var segments = vm.details.map(function(entry) {
		return new profile.InfoSegment(entry.title, entry.content).view({});
	});

	var associations = null;

	var university_insignia = (vm.basicInfo.unversity === 'University of Texas') ? 
		m("img", {src:"/img/bevo_icon.jpg", id:"bevo_icon"} )
		: null;

	return (
		m("div", {className:"base ui padded stackable grid"}, [
			m("div", {className:"row"}, [
				m("div", {className:"four wide column"}, [
					contact_card.view({})
				]),
				m("div", {className:"eight wide column"}, [
					m("h1", {className:"ui header"}, [
						vm.basicInfo.name,
						m("div", {className:"blue ui buttons right floated"}, [
							m("div", {className:"ui button"}, [
								m("i", {className:"mail icon"}),
								"Mail"
							]),
							m("div", {className:"ui positive button"}, [
								m("i", {className:"share alternate icon"}),
								"Connect"
							])
						])
					]),
					university_insignia,
					m("h5", {className:"university-title header"}, [
					m("i", [
						vm.basicInfo.university, " class of '",
						vm.basicInfo.graduation_year % 1000,
						m("br"),
						vm.basicInfo.major
					])
					]),
					m("div", {className:"description"}, [
						vm.basicInfo.description
					]),
					segments
				]),
				m("div", {className:"four wide column"}, [
					vm.connections.view({}),
					associations
				])
			])
		])
	);
};
