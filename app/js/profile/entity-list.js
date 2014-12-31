/**
 * Generic self-loading list of entities
 * @jsx m
 */

var EntityList = function (title, linkBase, entities) {
	var entitylist = {};

	entitylist.view = function () {
		var list = entities.map(function(entity) {
			return (
				<a href={linkBase + '/' + entity._id} config={m.route} className="item">
					<img className="ui top aligned avatar image" src="/img/square-image.png" />
					<div className="content">
						<div className="header">{entity.first_name + ' ' + entity.last_name}</div>
						{entity.role}
					</div>
				</a>
			);
		});
		return (
			<div>
				<h4 className="header">{title}</h4>
				<div className="ui divided very relaxed list">
					{list}
				</div>
			</div>
		);
	};

	return entitylist;
};

module.exports = EntityList;
