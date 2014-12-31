/**
 * @jsx m
 */

var API = require('common/api');
var Dropzone = require('common/form-builder').inputs.dropzone;

var ContactCard = function (user_image_url, social_links, description, editable) {
	var card = {};
	card.view = function () {
		//var img_drop = Dropzone('myDropzone', {url: API.calcAddress('/image')});
		var photo_url = (user_image_url == null) ? '/img/square-image.png' : user_image_url;
		var profilePicture = null;
		if (editable) {
			profilePicture = (
				<div className="image cssDimmer">
					<div className="ui active dimmer">
						<div className="content">
							<div className="center">
								<div className="ui inverted button">Change Photo</div>
							</div>
						</div>
					</div>
					<img src={photo_url} />
				</div>
			);
		} else {
			profilePicture = (
				<div className="image">
					<img src={photo_url} />
				</div>
			);
		}
		return (
			<div className="ui card">
				{profilePicture}
				<div className="content">
					<h4 className="ui header">{description}</h4>
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
