/**
 * Generic self-loading list of entities
 * @jsx m
 */

profile.EntityList = function (title, entity_ids) {
	var entitylist = {};
	entitylist.view = function () {
		return (
			<div>
				<h4 className="header">Connections</h4>
				<div className="ui divided very relaxed list">
					<a className="item">
						<img className="ui top aligned avatar image" src="/img/square-image.png" />
						<div className="content">
							<div className="header">Alexander Ventura</div>
							Developer
						</div>
					</a>
					<a className="item">
						<img className="ui top aligned avatar image" src="/img/square-image.png" />
						<div className="content">
							<div className="header">Brandon Olivier</div>
							Developer
						</div>
					</a>
					<a className="item">
						<img className="ui top aligned avatar image" src="/img/square-image.png" />
						<div className="content">
							<div className="header">Austin Stone</div>
							Developer
						</div>
					</a>
					<a className="item">
						<img className="ui top aligned avatar image" src="/img/square-image.png" />
						<div className="content">
							<div className="header">Santa Claus</div>
							Investor
						</div>
					</a>
				</div>
				<h4 className="header">Associations</h4>
				<div className="ui divided very relaxed list">
					<a className="item">
						<img className="ui top aligned avatar image" src="/img/square-image.png" />
						<div className="content">
							<div className="header">UT Alum Web App Jobs</div>
						</div>
					</a>
					<a className="item">
						<img className="ui top aligned avatar image" src="/img/square-image.png" />
						<div className="content">
							<div className="header">Computer Science Hackers</div>
						</div>
					</a>
				</div>
			</div>
		);
	};

	return entitylist;
};
