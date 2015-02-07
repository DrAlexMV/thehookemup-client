/**
 * This provides the invites sidebar.
 * @jsx m
 */

var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var Invites = require('model/invites');
var PopupLabel = require('common/ui-core/popup-label');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');


var InviteSegment = function () {
	var inviteSegment = {};

	var SMALL_MAX_ELEMENTS = 3;

	inviteSegment.vm = {
		showMore: m.prop(false)
	};

	var buildMailto = function(inviteCode) {
		var body = 'mailto:?Subject=Founderati.io%20Invite&Body=Hi%2C%0AI%27d%20like%20to%20invite%20you%20to%20Founderati%2C%20a%20website%20for%20entrepreneurs.%20Go%20here%20to%20claim%20your%20account%3A%0A%0Ahttp%3A//beta.founderati.io/login%3Finvite%3D{inviteCode}%0A%0ASee%20you%20there%21%0A';
		return body.replace('{inviteCode}', inviteCode);
	};

	var scratch = function(invite, scratchedOut) {
		Invites.putInvite(invite.inviteCode, {scratchedOut: scratchedOut}).then(function() {
			invite.scratchedOut = scratchedOut;
		});
	};

	inviteSegment.view = function (props) {
		var showToggle = null;
		if (props.invites.length > SMALL_MAX_ELEMENTS) {
			var showToggle = inviteSegment.vm.showMore() ?
				<div className="ui bottom right attached label">
					<a className="ui item" onclick={ function() { inviteSegment.vm.showMore(false); } }>
						Show fewer
					</a>
				</div> :
				<div className="ui bottom right attached label">
					<a className="ui item" onclick={ function() { inviteSegment.vm.showMore(true); } }>
						Show more
					</a>
				</div>;
		}

		var listUnused = props.invites.filter(function (invite) { return !invite.consumerObjectId; });

		if (!inviteSegment.vm.showMore()) {
			listUnused = listUnused
				.sort(function(a, b) { return a.scratchedOut; })
				.slice(0, SMALL_MAX_ELEMENTS);
		}

		listUnused = listUnused.map(function (invite, idx) {
				var mailButton = invite.scratchedOut ? null :
					<a href={ buildMailto(invite.inviteCode) }
						onclick={scratch.bind(this, invite, true)}
						data-variation="inverted"
						data-content="Mail to a friend (Marks as used)"
						data-position="bottom center"
						config={PopupLabel}>
						<i className="envelope icon"></i>
					</a>;
				var markButton = invite.scratchedOut ? null :
					<a onclick={scratch.bind(this, invite, true)}
						data-variation="inverted"
						data-content="Mark invite as used."
						data-position="bottom center"
						config={PopupLabel}>
						<i className="delete icon"></i>
					</a>;

				return (
					<div className="item">
						<div className={'content' + (invite.scratchedOut ? ' scratched-out' : '')}>
							<span data-variation="inverted"
								data-content={invite.scratchedOut ? 'This invite is marked as having been sent to someone, but nobody has used it yet.' : 'Click the mail icon to email a friend this invite.'}
								data-position="bottom center"
								config={PopupLabel}>
								{ invite.inviteCode }
							</span>
							{mailButton}
							{markButton}
						</div>
					</div>
				);
			});

		return (
			<div className="ui segment">
				<h4 className="ui header">Invite Others</h4>
				<div className="ui relaxed divided items">
					{ listUnused }
				</div>
				{ showToggle }
			</div>
		);
	};

	return inviteSegment;
};

module.exports = InviteSegment;
