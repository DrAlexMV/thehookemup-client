/**
 * Created by austinstone on 1/25/15.
 */


var API = require('common/api');
var User = require('model/user');

var Invites = function(API) {
  var invites = {};

  invites.InvitesModel = function(data) {
    console.log(data);
    this.invites = m.prop(data.invites.map(
      function(invite) {
        var consumer = null;
        if (typeof invite.consumerObjectId != 'undefined' &&  invite.consumerObjectId !=null )
        {
          User.getByID(invite.consumerObjectId).then(function(response){
            consumer = response
          })
        }

        return {
          consumer: consumer,
          inviteCode: invite.inviteCode
        }
      }
    ));


  };

  invites.getInvites = function() {
    return this.get('/invites', invites.InvitesModel);
  };

  _.mixin(invites, API);
  return invites;
};

module.exports = Invites(API);
