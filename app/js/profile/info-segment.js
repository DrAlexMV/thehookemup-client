/**
 * @jsx m
 */

var Editable = require('common/form-builder').inputs.editable;

var InfoSegment = function (title, content, editable) {
	var segment = {};

	function viewEdit() {
		function addItem(sectionIndex) {
			return function() {
				if (!content[sectionIndex].subpoints) {
					content[sectionIndex].subpoints = [];
				}
				content[sectionIndex].subpoints.push({
					title: m.prop('Add a title'),
					description: m.prop('Enter a description.')
				});
			}
		}

		function addSection(sectionList) {
			return function() {
				sectionList.push({
					title: m.prop('Add a title'),
					description: m.prop('Enter a description.'),
					subpoints: []
				});
			}
		}

		var items = content.map(function(item, index) {
			var subpoints = null;
			if (item.subpoints) {
				subpoints = item.subpoints.map(function(point) {
					return (
						<div className="item">
							<i className="right triangle icon"></i>
							<div className="content subfield-editable">
								<div className="header"
									config={Editable(point.title, {})}>
									{point.title()}
								</div>
								<div data-type="textarea"
									data-inputclass="ui fluid"
									config={Editable(point.description, {})}>
									{point.description()}
								</div>
							</div>
						</div>
					);
				});
			}
			return (
				<div className="item">
					<div className="header"
						config={Editable(item.title, {})}>
						{item.title()}
					</div>
					<div className="content">
						<div data-inputclass="ui fluid"
							data-type="textarea"
							config={Editable(item.description, {})}>
							{item.description()}
						</div>
						<div className="list">
							{subpoints}
							<div className="item">
								<a onclick={addItem(index)}>
									<i className="right triangle icon"></i>
									+ Add item
								</a>
							</div>
						</div>
					</div>
				</div>
			);
		});

		return (
			<div className="ui list">
				{items}
				<div className="item">
					<a onclick={addSection(content)}>
						+ Add section
					</a>
				</div>
			</div>
		);
	}

	function viewRegular() {
		var items = content.map(function(item) {
			var subpoints = null;
			if (item.subpoints) {
				subpoints = item.subpoints.map(function(point) {
					return (
						<div className="item">
							<i className="right triangle icon"></i>
							<div className="content">
								<div className="header">{point.title()}</div>
								<div className="description">{point.description()}</div>
							</div>
						</div>
					);
				});
			}
			return (
				<div className="item">
					<div className="header">{item.title()}</div>
					<div className="content">
						{item.description()}
						<div className="list">
							{subpoints}
						</div>
					</div>
				</div>
			);
		});

		return <div className="ui list">{items}</div>;
	}

	segment.view = function () {
		return (
			<div className="ui segment">
				<div className="ui ribbon label">
					<h4 className="ui header">{title.toUpperCase()}</h4>
				</div>
				{ editable ? viewEdit() : viewRegular() }
			</div>
		);
	};

	return segment;
};

module.exports = InfoSegment;
