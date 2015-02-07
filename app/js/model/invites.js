var API = require('common/api');
var User = require('model/user');

var Invites = function(API) {
	var invites = {};

	invites.InvitesModel = function(data) {
		this.invites = data.invites.map(function(invite) {
			return invite;
		});

		return this;
	};

	invites.getInvites = function() {
		return this.get('/invites', invites.InvitesModel);
	};

	invites.putInvite = function(inviteID, inviteObject) {
		return this.put('/invites/' + inviteID, inviteObject);
	};

	invites.validate = function(inviteID) {
		return this.get('/invites/validate/' + inviteID);
	};

	_.mixin(invites, API);
	return invites;
};

module.exports = Invites(API);
