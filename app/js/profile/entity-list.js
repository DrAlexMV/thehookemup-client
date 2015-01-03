/**
 * Generic self-loading list of entities
 * @jsx m
 */

var EntityList = function (title, linkBase, entities, model) {
	var entitylist = {};

	entitylist.view = function () {
		var list = [];
		if (entities) {
			list = entities.map(function(entity) {
				return (
					<a href={linkBase + '/' + entity._id()} config={m.route} className="item">
						<img className="ui top aligned avatar image"
							src={model.getPicture(entity)} />
						<div className="content">
							<div className="header">{model.getName(entity)}</div>
							{entity.role()}
						</div>
					</a>
				);
			});
		}
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
