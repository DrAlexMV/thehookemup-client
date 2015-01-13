/**
 * Provides dashboard page
 * @jsx m
 */

var Context = require('common/context');
var EntityList = require('profile/entity-list');
var Error = require('common/error');
var HorizontalEntityListSegment = require('dashboard/horizontal-entity-list-segment');
var User = require('model/user');
var UserEdges = require('model/user-edges');
var StreamCommon = require('common/stream-common');


var handlePlural = require('common/utils-general').handlePlural;

function twitterIntegration(element, isInitialized) {
	if (!isInitialized) {
		!function(d,s,id){
			var js, fjs = element, p = /^http:/.test(d.location) ? 'http' : 'https';
			if (!d.getElementById(id)) {
				js = d.createElement(s);
				js.id = id;
				js.src = p + "://platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js,fjs);
			}
		}(document,"script","twitter-wjs");
	}
}

var dashboard = {};

dashboard.vm = {
	init: function () {
		this.pendingRequestsSegment = null;
		this.connectionsSegment = null;
		this.suggestedConnectionsList = null;

		this.basicInfo = null;
		this.edges = null;
		this.pendingConnections = [];
		this.suggestedConnections = [];

		Context.getCurrentUser().then(function(response) {
			dashboard.vm.basicInfo = response;
		});

		// Perhaps change to call to singleton
		UserEdges.getByID('me').then(
			function(response) {
				dashboard.vm.edges = response;
				dashboard.vm.connectionsSegment = new HorizontalEntityListSegment(
					'Connections',
					'/profile',
					 response.connections(),
					 User,
					 {searchable: true}
				);
			}, Error.handle);

		UserEdges.getMyPendingConnections().then(
			function(response) {
				dashboard.vm.pendingConnections = response;
				dashboard.vm.pendingRequestsSegment = new HorizontalEntityListSegment(
					'Pending Requests',
					'/profile',
					 response,
					 User,
					 {showAll: true}
				);
			}, Error.handle);

		UserEdges.getMySuggestedConnections().then(
			function(response) {
				dashboard.vm.suggestedConnections = response;
			}, Error.handle);
	}
};

dashboard.stream = Bacon.mergeAll(Context.stream);

StreamCommon.on(dashboard.stream, 'Context::PendingConnections', function (message) {
  /*i = 0
  while(i<1000000000){i++}*/
  //dashboard.vm.init();
  dashboard.vm.pendingConnections=message.parameters.pendingConnections;
  dashboard.vm.pendingRequestsSegment = new HorizontalEntityListSegment(
        'Pending Requests',
        '/profile',
        message.parameters.pendingConnections,
        User,
        {showAll: true}
      );
  console.log("heard message in dashboard from context!!");
  console.log(dashboard.vm.pendingConnections);

}, true);

dashboard.controller = function () {
	dashboard.vm.init();
};

dashboard.view = function () {
	var vm = dashboard.vm;

	var basicInfo = dashboard.vm.basicInfo();
	var numPendingRequests = dashboard.vm.pendingConnections.length;
	var numConnections = dashboard.vm.edges.connections().length;
	var numAssociations = 5;

	var suggestedConnectionsSegment = new EntityList(
		'Suggested Connections',
		'/profile',
		dashboard.vm.suggestedConnections,
		User,
		true
	).view({});

	return (
		<div className="ui stackable padded grid">
			<div className="row">
				<div className="four wide column">
					<div className="ui stackable grid">
						<div className="row">
							<div className="sixteen wide tablet computer only column" config={twitterIntegration}>
							  <a className="twitter-timeline" href="https://twitter.com/search?q=austin%20startup" data-widget-id="552673756879912961">Tweets about austin startup</a>
							</div>
						</div>
						<div className="row">
							<div className="sixteen wide tablet computer only column">
								<div className="ui segment">
									<img className="ad" src="/img/sample_ad.jpeg" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="twelve wide column">
					<div className="ui stackable grid">
						<div className="row">
							<div className="sixteen wide column">
								<div className="ui segment bull">
									<div className="ui grid">
										<div className="row">
											<div className="six wide column">
												<div className="ui header">
													Howdy, {basicInfo.firstName()}!
												</div>
												Looks like you're new to the site!
												You're going to want to fill out your profile with your
												avid interests, proudest moments, and best skills.
												<div className="ui bulleted list">
													<a href="/profile/me" config={m.route} className="item">Update my profile</a>
												</div>
											</div>
											<div className="twelve wide computer tablet only column"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						 <div className="row">
							<div className="ten wide column">
								<div className="ui segment">
									<h4 className="ui left floated header">Today</h4>
									<div className="ui statistic">
										<div className="value">{numPendingRequests}</div>
										<div className="label">
											<div className="ui list">
												<a href="#pending-requests" className="item">
													{handlePlural('Pending Request', numPendingRequests)}
												</a>
											</div>
										</div>
									</div>
									<div className="ui statistic">
										<div className="value">{numConnections}</div>
										<div className="label">
											<div className="ui list">
												<a href="#connections" className="item">
													{handlePlural('Connection', numConnections)}
												</a>
											</div>
										</div>
									</div>
									<div className="ui statistic">
										<div className="value">{numAssociations}</div>
										<div className="label">
											<div className="ui list">
												<a className="item">
													{handlePlural('Association', numAssociations)}
												</a>
											</div>
										</div>
									</div>
								</div>
								<div className="ui segment">
									<h4 className="ui header">Actions</h4>
									<div className="ui content">
										<div className="ui bulleted list">
											<a className="item">Find someone</a>
											<a href="/profile/me" config={m.route} className="item">Update my profile</a>
										</div>
									</div>
								</div>
								<div id="pending-requests"></div>
								{ dashboard.vm.pendingRequestsSegment ?
									dashboard.vm.pendingRequestsSegment.view({}) : null }
								<div id="connections"></div>
								{ dashboard.vm.connectionsSegment ?
									dashboard.vm.connectionsSegment.view({}) : null }
							</div>
							<div className="six wide column">
								{ suggestedConnectionsSegment }
								<div className="ui segment">
									<h4 className="ui header">Suggested Associations</h4>
									<div className="ui divided very relaxed list">
										<a className="item">
											<img className="ui center aligned avatar image" src="/img/square-image.png" />
											<div className="content">
												<div className="header">UT Alum Web App Jobs</div>
											</div>
										</a>
										<a className="item">
											<img className="ui center aligned avatar image" src="/img/square-image.png" />
											<div className="content">
												<div className="header">Computer Sci Hackers</div>
											</div>
										</a>
									</div>
								</div>
								<div className="ui segment">
									<img className="ad" src="/img/sample_ad.jpeg" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


module.exports = dashboard;
