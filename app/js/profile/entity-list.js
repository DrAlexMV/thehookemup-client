/**
 * Generic self-loading list of entities
 * @jsx m
 */

var EntityList = function (title, entities, settings) {
	var entitylist = {};

	var defaultSettings = {
		inSegment: false,
		ordered: false
	};

	settings = _.extend(defaultSettings, settings);

	entitylist.view = function () {
		var list = [];

		if (entities) {
			list = entities.map(function(entity) {
				return (
					<a href={entity.getPath() + '/' + entity._id()} config={m.route} className="item">
						<img className="ui top aligned avatar image"
							src={entity.getPicture()} />
						<div className="content">
							<div className="header">{ entity.getName() }</div>
							{entity.roles ? entity.roles().join(', ') : ''}
						</div>
					</a>
				);
			});
		}

		return (
			<div className={settings.inSegment ? 'ui segment' : null}>
				<h4 className="ui header">{title}</h4>
				<div className={"ui divided very relaxed " + (settings.ordered ? "ordered" : "") + " list" }>
					{list}
				</div>
			</div>
		);
	};

	return entitylist;
};

module.exports = EntityList;
