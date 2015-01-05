/**
 * Provides profile page
 * @jsx m
 */

var PopupLabel = require('common/ui-core/popup-label');
var ContactCard = require('profile/contact-card');
var EntityList = require('profile/entity-list');
var Error = require('common/error');
var InfoSegment = require('profile/info-segment');
var User = require('model/user');
var UserDetails = require('model/user-details');
var UserEdges = require('model/user-edges');
var ImageModel = require('model/image');
var StreamCommon = require('common/stream-common');
var Context = require('common/context');

var profile = {};

profile.vm = {
	init: function () {
		userid = m.route.param('userid');

		this.basicInfo = null;
		this.contactCard = null;
		this.isConnected = m.prop();

		profile.stream = null;

		function handleLoadUser(response) {
			profile.vm.basicInfo = response;
			profile.vm.contactCard = new ContactCard(profile.vm.basicInfo, userid == 'me');

			profile.stream = Bacon.mergeAll(profile.vm.contactCard.vm.profilePicture.stream);
			StreamCommon.on(profile.stream,
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
			Context.getCurrentUser().then(handleLoadUser); // Use Auth's singleton prop
			this.isConnected(true);
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
				// TODO: use parallel query. Potentially doubles latency
				// .when(UserEdges.getByID(userid), Context.getCurrentUser())
				if (userid !== 'me') { // prevent double call
					Context.getCurrentUser().then(function(me) {
						var connected = UserEdges.isConnection(me()._id(), userid, profile.vm.edges);
						profile.vm.isConnected(connected);
					});
				}
			}, Error.handle);
	}
};

profile.connectTo = function(otherUserID) {
	User.connectMe(m.route.param('userid')).then(
		function() {
			console.log('connected to', m.route.param('userid'));
			// these should be loaded by now, but who knows
			if (profile.vm.edges) {
				var conns = profile.vm.edges.connections();
				conns.push(profile.vm.basicInfo());
				profile.vm.edges.connections(conns);
			}
			profile.vm.isConnected(true);
		},
		function() {console.log('failed to connect')}
	);
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
						{
							vm.isConnected() ?
								<div className="ui buttons right floated">
									<div className="ui icon positive button"
										data-variation="inverted"
										data-content="Connected"
										data-position="bottom center"
										config={PopupLabel}>
										<i className="share alternate icon"></i>
									</div>
									<a href={'mailto:'+basicInfo.email()} className="ui button blue">
										<i className="mail icon"></i>Mail
									</a>
								</div> :
								<div className="ui positive button right floated" onclick={profile.connectTo}>
									<i className="share alternate icon"></i>
									Connect
								</div>
						}
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
