/**
 * @jsx m
 */

var InfoSegment = function (title, content) {
	var segment = {};
	segment.view = function () {
		var items = content.map(function(item) {
			var subpoints = null;
			if (item.subpoints) {
				subpoints = item.subpoints.map(function(point) {
					return (
						<div className="item">
							<i className="right triangle icon"></i>
							<div className="content">
								<a className="header">{point.title}</a>
								<div className="description">{point.description}</div>
							</div>
						</div>
					);
				});
			}
			return (
				<div className="item">
					<div className="header">{item.title}</div>
					<div className="content">
						{item.description}
						<div className="list">
							{subpoints}
						</div>
					</div>
				</div>
			);
		});

		return (
			<div className="ui segment">
				<div className="ui ribbon label"><h4 className="ui header">{title.toUpperCase()}</h4></div>
				<div className="ui list">
					{items}
				</div>
			</div>
		);
	};

	return segment;
};

module.exports = InfoSegment;
