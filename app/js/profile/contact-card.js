/**
 * @jsx m
 */

var API = require('common/api');
var EditableImage = require('common/editable-image');

var ContactCard = function (basicUserInfo, editable) {
	var card = {};

    var findWebsiteUrl = function (websiteName) {
        var url = _.filter(basicUserInfo().handles(), function(entry) { return (entry.type==websiteName); });
        url = (url.length>0) ? url[0] : null;
        return url;
    };

	card.vm = {
		profilePicture: new EditableImage()

	};

    //TODO: finish linking handles to buttons
    var desiredHandles = ['linkedin', 'github', 'facebook', 'twitter', 'google'];


    findWebsiteUrl('linkedin')==null ? function(){} : m.route.bind(this, findWebsiteUrl('linkedin'))

	card.view = function (props) {
		return (
			<div className="ui card">
				{card.vm.profilePicture.view({
					editable: editable,
					userImageURL: basicUserInfo().picture()
				})}
				<div className="content">
					<h4 className="ui header">{basicUserInfo().roles().join(', ')}</h4>
					<div className="ui divider"></div>
					<div className="ui circular linkedin icon button">
						<i className="linkedin icon"></i>
					</div>
					<div className="ui circular github icon button">
						<i className="github icon"></i>
					</div>
					<div className="ui circular facebook icon button">
						<i className="facebook icon"></i>
					</div>
					<div className="ui circular twitter icon button">
						<i className="twitter icon"></i>
					</div>
					<div className="ui circular google plus icon button">
						<i className="google plus icon"></i>
					</div>
				</div>
			</div>
		);
	};

	return card;
};

module.exports = ContactCard;
