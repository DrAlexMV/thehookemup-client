/**
 * @jsx m
 */

var API = require('common/api');
var EditableImage = require('common/editable-image');

var ContactCard = function (basicUserInfo, editable) {
	var card = {};

	card.vm = {
		profilePicture: new EditableImage(basicUserInfo.picture, editable)
	};

	card.view = function () {
		return (
			<div className="ui card">
				{card.vm.profilePicture.view({})}
				<div className="content">
					<h4 className="ui header">{basicUserInfo.role()}</h4>
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
