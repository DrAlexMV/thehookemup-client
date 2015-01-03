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
var UserEdges = require('model/user-edges');
var ImageModel = require('model/image');
var StreamCommon = require('common/stream-common');
var Auth = require('common/auth');

var profile = {};

profile.vm = {
	init: function () {
		userid = m.route.param('userid');

		this.basicInfo = null;
		this.contactCard = null;

		function handleLoadUser(response) {
			profile.vm.basicInfo = response;
			profile.vm.contactCard = new ContactCard(profile.vm.basicInfo, userid == 'me');
			StreamCommon.on(profile.vm.contactCard.vm.profilePicture.stream,
				'EditableImage::ReplaceImageURL',
				function (message) {
					var basicInfo = profile.vm.basicInfo;
					if (basicInfo().picture()) {
						ImageModel.deleteImage(basicInfo().picture());
					}
					basicInfo().picture(message.parameters.imageID);
					User.updatePicture(userid, basicInfo().picture());
				}
			);
		}

		// we might already have the data
		if (userid === 'me') {
			Auth.getCurrentUser(handleLoadUser); // Use Auth's singleton prop
		} else {
			User.getByID(userid).then(function(userObject) {
				handleLoadUser(m.prop(userObject)); // Make a new prop
			}, Error.handle);
		}

		this.details = [];
		UserDetails.getByID(userid).then(
			function(response) {
				profile.vm.details = response;
			}, Error.handle);

		this.edges = null;
		UserEdges.getByID(userid).then(
			function(response) {
				profile.vm.edges = response;
			}, Error.handle);
	}
};

profile.connectTo = function(otherUserID) {
	User.connectMe(m.route.param('userid')).then(
		function() {console.log('connected to', m.route.param('userid'))},
		function() {console.log('failed to connect')});
};

profile.controller = function () {
	profile.vm.init();
};

profile.view = function () {
	var vm = profile.vm;
	var basicInfo = profile.vm.basicInfo();

	var segments = vm.details.map(function(entry) {
		return new InfoSegment(entry.title(), entry.content()).view({});
	});

	var associations = null;

	var university_insignia = (basicInfo.university === 'University of Texas') ? 
		<img src="/img/bevo_icon.jpg" id="bevo_icon" />
		: null;

	var university_info = null;
	if (basicInfo.university()) {
		university_info = (
			<div>
				{university_insignia}
				<h5 className="university-title header"><i>
					{basicInfo.university()} class of &#39;
					{basicInfo.graduationYear() % 1000}
					<br/>
					{basicInfo.major()}
				</i></h5>
			</div>
		);
	}

	var connections = new EntityList(
		'Connections',
		'/profile',
		 profile.vm.edges.connections(),
		 User
	);

	return (
		<div className="ui padded stackable grid">
			<div className="row">
				<div className="four wide column">
					{vm.contactCard.view({})}
				</div>
				<div className="eight wide column">
					<h1 className="ui header">
						{User.getName(basicInfo)}
						<div className="blue ui buttons right floated">
							<div className="ui button">
								<i className="mail icon"></i>
								Mail
							</div>
							<div className="ui positive button" onclick={profile.connectTo}>
								<i className="share alternate icon"></i>
								Connect
							</div>
						</div>
					</h1>
					{university_info}
					<div className="description">
						{basicInfo.description()}
					</div>
					{segments}
				</div>
				<div className="four wide column">
					{connections.view({})}
				</div>
			</div>
		</div>
	);
};

module.exports = profile;
