/**
 * @jsx m
 */

// Two column wide except on mobile
var HorizontalEntityListSegment = function (title, linkBase, entities, model, config) {
	var horizontalEntityList = {};

	var SMALL_MAX_ELEMENTS = 6;
	var LARGE_MAX_ELEMENTS = 14;

	horizontalEntityList.vm = {
		searchInput: m.prop(''),
		showMore: m.prop(false)
	};

	function makeItem(entity) {
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
	}

	horizontalEntityList.view = function () {
		var items = [];

		if (entities) {
			var filteredItems = [];
			// Filter if we have search:
			if (config.searchable && horizontalEntityList.vm.searchInput()) {
				var query = horizontalEntityList.vm.searchInput();
				filteredItems = entities.filter(function(entity) {
					return model.getName(entity).toLowerCase().indexOf(query.toLowerCase()) != -1;
				});
			} else {
				filteredItems = entities;
			}

			var showNumber = horizontalEntityList.vm.showMore() ?
				(config.showAll ?
					filteredItems.length : LARGE_MAX_ELEMENTS) :
				SMALL_MAX_ELEMENTS;
			
			items = filteredItems.slice(0, showNumber).map(makeItem);
		}

		var search = null;
		if (config.searchable) {
			search = <input
				type="text"
				placeholder="Search name"
				oninput={m.withAttr("value", horizontalEntityList.vm.searchInput)}
				value={horizontalEntityList.vm.searchInput()}/>;
		}

		var showToggle = null;
		if (entities.length > SMALL_MAX_ELEMENTS) {
			var showToggle = horizontalEntityList.vm.showMore() ?
				<div className="ui bottom right attached label">
					<a className="ui item" onclick={ function() { horizontalEntityList.vm.showMore(false); } }>
						Show fewer
					</a>
				</div> :
				<div className="ui bottom right attached label">
					<a className="ui item" onclick={ function() { horizontalEntityList.vm.showMore(true); } }>
						Show more
					</a>
				</div>;
		}

		return (
			<div className="ui segment">
				<h4 className="ui header">
					{title}
					<div className="ui input small">
						{search}
					</div>
				</h4>
				<div className="ui list horizontal-list">
					{items}
				</div>
				{showToggle}
			</div>
		);
	};

	return horizontalEntityList;
};

module.exports = HorizontalEntityListSegment;
