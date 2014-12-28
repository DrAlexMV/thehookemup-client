/**
 * @jsx m
 */

profile.ContactCard = function (user_image_url, social_links) {
	var card = {};
	card.view = function () {
		return (
			<div className="ui card">
				<div className="image">
					<img src={user_image_url} />
				</div>
				<div className="content">
					<h4 className="ui header">Developer</h4>
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
