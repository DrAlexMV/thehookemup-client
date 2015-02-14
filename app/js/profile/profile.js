/**
 * Provides profile page
 * @jsx m
 */

var ConnectWith = require('profile/connect-with');
var ContactCard = require('profile/contact-card');
var Context = require('common/context');
var EditableText = require('common/editable-text');
var EndorsementButton = require('engagement/endorsements/endorsement-button');
var EntityList = require('profile/entity-list');
var Error = require('common/error');
var ImageModel = require('model/image');
var InterestsSegment = require('profile/interests-segment');
var ModalMixin = require('common/modal-mixin');
var PopupLabel = require('common/ui-core/popup-label');
var ProjectsSegment = require('profile/projects-segment');
var SkillsSegment = require('profile/skills-segment');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserDetails = require('model/user-details');
var UserEdges = require('model/user-edges');

var profile = {};

profile.vm = {
    init: function () {
        this.userid =
            userid = m.route.param('userid');

        this.basicInfo = null;
        this.contactCard = null;
        this.skillsSegment = null;
        this.interestsSegment = null;
        this.projectsSegment = null;
        this.editing = m.prop(false);
        this.editables = {description: null};

        profile.stream = null;

        function handleLoadUser(response) {
            profile.vm.basicInfo = response;
            profile.vm.editables.description = EditableText.buildConfig(
                profile.vm.basicInfo().description,
                'Add a description of yourself.'
            );

            profile.vm.contactCard = new ContactCard(profile.vm.basicInfo, userid === 'me');

            profile.vm.connectWithModal = new ModalMixin(new ConnectWith(profile.vm.basicInfo));

            profile.vm.endorsementButton = EndorsementButton(userid, 'user');

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
        } else {
            User.getByID(userid).then(function (userObject) {
                Context.getCurrentUser().then(function (loggedInUser) { // Should already be locally loaded.
                    if (loggedInUser()._id() === userObject._id()) {
                        m.route('/profile/me'); // Redirect if we're on our own page.
                    }
                });

                handleLoadUser(m.prop(userObject)); // Make a new prop
            }, Error.handle);
        }

        this.details = null;
        UserDetails.getByID(userid).then(
            function (response) {
                profile.vm.details = response;
                profile.vm.skillsSegment = new SkillsSegment(response.skills, profile.vm.userid == 'me', userid);
                profile.vm.interestsSegment = new InterestsSegment(response.interests, profile.vm.userid == 'me', userid);
                profile.vm.projectsSegment = new ProjectsSegment(response.projects, profile.vm.userid == 'me', userid);

            }, Error.handle);

        this.edges = null;
        UserEdges.getByID(userid).then(
            function (response) {
                profile.vm.edges = response;
            }, Error.handle);
    }
};

// Serves as both request and confirmation
profile.connectMe = function (isConfirmation, message) {
    return function () {
        UserEdges.connectMe(m.route.param('userid'), message).then(
            function () {
                if (isConfirmation) {
                    // Get user's email, along with correct connections list, etc.
                    User.getByID(userid).then(function (userObject) {
                        profile.vm.basicInfo(userObject);
                    }, Error.handle);
                } else {
                    profile.vm.basicInfo().connectionType('s'); // Sent
                }
            },
            function () {
                console.log('failed to connect');
            }
        );
    };
};

profile.deleteConnection = function () {
    UserEdges.deleteConnection(m.route.param('userid')).then(
        function () {
            profile.vm.basicInfo().connectionType(''); // Not connected/NA
        },
        function () {
            console.log('failed to delete');
        }
    );
};

profile.connectDialog = function (otherUserID) {
    profile.vm.connectWithModal.vm.open();
    StreamCommon.on(profile.stream, 'ConnectWithModal::Connect', function (message) {
        profile.connectMe(false, message.parameters.message)();
    })
};

//listen to input from the modal. An input of 'ConnectWithModal::NoConnect' means the user clicked the the button on
//the modal to close the window without connecting.
//StreamCommon.on(profile.stream, 'ConnectWithModal::NoConnect', function() {});


profile.saveDetail = function () {
    User.putByID(
        profile.vm.userid,
        { description: profile.vm.basicInfo().description() }
    )
        .then(function () {
            profile.vm.editing(false);
        });
};

profile.controller = function () {
    profile.vm.init();
};

profile.view = function () {
    var vm = profile.vm;
    var basicInfo = profile.vm.basicInfo();
    var university_insignia = (basicInfo.university() === 'University of Texas') ?
        <img src="/img/bevo_icon.jpg" id="bevo_icon" />
        : null;

    var connectionButtons = null;
    var isConnectedIcon = null;

    // Connected
    if (basicInfo.connectionType() == 'c') {
        connectionButtons = (
            <a className="ui button blue contact-button"
            href={'mailto:' + basicInfo.email()}>
                <i className="mail icon"></i>
            Contact
            </a>
            );

        isConnectedIcon = (
            <i className="share alternate icon connected-icon"
            data-variation="inverted"
            data-content="Connected"
            data-position="bottom center"
            config={PopupLabel}>
            </i>
            );
        // Sent
    } else if (basicInfo.connectionType() == 's') {
        connectionButtons = (
            <div className="ui positive disabled button">
                <i className="share alternate icon"></i>
            Request Sent
            </div>
            );
        // pending approval
    } else if (basicInfo.connectionType() == 'pa') {
        connectionButtons = (
            <div className="ui buttons">
                <div className="ui negative icon button" onclick={profile.deleteConnection}
                data-variation="inverted"
                data-content="Dismiss request"
                data-position="bottom center"
                config={PopupLabel}>
                    <i className="remove icon"></i>
                </div>
                <div className="ui positive button" onclick={profile.connectMe(true)}
                data-variation="inverted"
                data-content="Approve request"
                data-position="bottom center"
                config={PopupLabel}>
                    <i className="checkmark icon"></i>
                Add
                </div>
            </div>
            );
        // not connected/other
    } else {
        connectionButtons = (
            <div className="ui positive button" onclick={profile.connectDialog}>
				{vm.connectWithModal.view()}
                <i className="share alternate icon"></i>
            Connect
            </div>
            );
    }


    var university_info = null;
    if (basicInfo.university()) {
        university_info = (
            <div>
				{university_insignia}
                <h5 className="university-title header">
                    <i>
					{basicInfo.university()} class of &#39;
					{basicInfo.graduationYear() % 1000}
                        <br/>
					{basicInfo.major()}
                    </i>
                </h5>
            </div>
            );
    }

    var description = profile.vm.editing() ?
        EditableText.view(profile.vm.editables.description) :
        <div className="description">
			{basicInfo.description()}
		</div>;

	var connections = new EntityList('Connections', profile.vm.edges.connections());

	var editButton = null;
	if (profile.vm.userid == 'me') {
		if (profile.vm.editing()) {
			editButton = (
				<div>
					<div className="mini ui buttons">
						<div className="ui blue button" onclick={profile.saveDetail}>
							Save
						</div>
						<div className="ui red button"
							onclick={function() {profile.vm.editing(false)} }>
							Discard
						</div>
					</div>
					<div className="ui hidden divider"></div>
				</div>

			);
		} else {
			editButton = (
				<div>
					<div className="mini ui blue button"
						onclick={function() {profile.vm.editing(true)} }>
						Edit
					</div>
					<div className="ui hidden divider"></div>
				</div>
			);
		}
	}

	return (
		<div className="ui padded stackable grid">
			<div className="row">
				<div className="four wide column">
					{vm.contactCard.view({})}
				</div>
				<div className="eight wide column">
					<h1 className="ui header">
						{ isConnectedIcon }
						{ basicInfo.getName() }
						{ connectionButtons }
					</h1>
					{editButton}

					{university_info}
					{description}

					{profile.vm.skillsSegment ? profile.vm.skillsSegment.view({}) : null}
					{profile.vm.interestsSegment ? profile.vm.interestsSegment.view({}) : null}
					{profile.vm.projectsSegment ? profile.vm.projectsSegment.view({
                        connections: profile.vm.edges.connections()
                    }) : null}

                </div>
                <div className="four wide column">
					{connections.view({})}
                </div>
            </div>
        </div>
        );
};

module.exports = profile;
