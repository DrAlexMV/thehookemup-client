/**
 * Provides profile page
 * @jsx m
 */

var ContactCard = require('profile/contact-card');
var EntityList = require('profile/entity-list');
var Error = require('common/error');
var InfoSegment = require('profile/info-segment');
var User = require('model/user');
var UserDetails = require('model/user-details');

var profile = {};

profile.vm = {
	init: function () {
		var userid = m.route.param('userid');
		this.basicInfo = {};
		User.getByID(userid).then(
			function(response) {
				profile.vm.basicInfo = response;
			}, Error.handle);

		/* {
			name: 'Nicholas Sundin',
			graduation_year: 2016,
			major: 'B.S. Computer Science',
			description: 'Hacker who likes to burn the midnight oil as he discovers and tries out new ideas and technologies.',
			university: 'University of Texas',
		};*/

		/*
		 * Details could be a recursive structure, but explicitly limiting to
		 * two levels of detail to avoid possible buffer-overflow and
		 * design-overflow issues.
		 */
		this.details = [];
		UserDetails.getByID(userid).then(
			function(response) {
				profile.vm.details = response;
			}, Error.handle);/*
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
		];*/

		this.edges = {
			connections: [2, 3, 4, 5],
			associations: [6, 7],
		};

		this.connections = new EntityList('Connections', this.edges.connections);


	}
};

profile.controller = function () {
	profile.vm.init();
};

profile.view = function () {
	var vm = profile.vm;
	var contact_card = new ContactCard('/img/self-small.jpg', {}, vm.basicInfo.role());

	var segments = vm.details.map(function(entry) {
		return new InfoSegment(entry.title, entry.content).view({});
	});

	var associations = null;

	var university_insignia = (vm.basicInfo.university === 'University of Texas') ? 
		<img src="/img/bevo_icon.jpg" id="bevo_icon" />
		: null;

	var university_info = null;
	if (vm.basicInfo.university()) {
		university_info = (
			<div>
				{university_insignia}
				<h5 className="university-title header"><i>
					{vm.basicInfo.university()} class of &#39;
					{vm.basicInfo.graduation_year() % 1000}
					<br/>
					{vm.basicInfo.major()}
				</i></h5>
			</div>
		);
	}

	return (
		<div className="base ui padded stackable grid">
			<div className="row">
				<div className="four wide column">
					{contact_card.view({})}
				</div>
				<div className="eight wide column">
					<h1 className="ui header">
						{vm.basicInfo.first_name() + ' ' + vm.basicInfo.last_name()}
						<div className="blue ui buttons right floated">
							<div className="ui button">
								<i className="mail icon"></i>
								Mail
							</div>
							<div className="ui positive button">
								<i className="share alternate icon"></i>
								Connect
							</div>
						</div>
					</h1>
					{university_info}
					<div className="description">
						{vm.basicInfo.description()}
					</div>
					{segments}
				</div>
				<div className="four wide column">
					{vm.connections.view({})}
					{associations}
				</div>
			</div>
		</div>
	);
};

module.exports = profile;
