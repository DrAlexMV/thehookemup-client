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

var profile = {};

profile.vm = {
	init: function () {
		userid = m.route.param('userid');

		this.basicInfo = null;
		this.contactCard = null;

		User.getByID(userid).then(function(response) {
			profile.vm.basicInfo = response;
			profile.vm.contactCard = new ContactCard(profile.vm.basicInfo, userid == 'me');
			StreamCommon.on(profile.vm.contactCard.vm.profilePicture.stream,
				'EditableImage::ReplaceImageURL',
				function (message) {
					var basicInfo = profile.vm.basicInfo;
					if (basicInfo.picture()) {
						ImageModel.deleteImage(basicInfo.picture());
					}
					basicInfo.picture(message.parameters.imageID);
					User.updatePicture(userid, picture);
				}
			);
			}, Error.handle);

		this.details = [];
		UserDetails.getByID(userid).then(
			function(response) {
				profile.vm.details = response;
			}, Error.handle);

		this.edges = {};
		UserEdges.getByID(userid).then(
			function(response) {
				profile.vm.edges = response;
			}, Error.handle);
	}
};

profile.controller = function () {
	profile.vm.init();
};

profile.view = function () {
	var vm = profile.vm;

	var segments = vm.details.map(function(entry) {
		return new InfoSegment(entry.title(), entry.content()).view({});
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
					{vm.basicInfo.graduationYear() % 1000}
					<br/>
					{vm.basicInfo.major()}
				</i></h5>
			</div>
		);
	}

	var connections = new EntityList('Connections', '/profile', profile.vm.edges.connections());
	var associations = new EntityList('Associations', '/', profile.vm.edges.associations());

	return (
		<div className="ui padded stackable grid">
			<div className="row">
				<div className="four wide column">
					{vm.contactCard.view({})}
				</div>
				<div className="eight wide column">
					<h1 className="ui header">
						{vm.basicInfo.firstName() + ' ' + vm.basicInfo.lastName()}
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
					{connections.view({})}
					{associations.view({})}
				</div>
			</div>
		</div>
	);
};

module.exports = profile;
