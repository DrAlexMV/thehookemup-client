/**
 * @jsx m
 */

profile.InfoSegment = function (title, content) {
	var segment = {};
	segment.view = function () {
		var items = content.map(function(item) {
			var subpoints = null;
			if (item.subpoints) {
				subpoints = item.subpoints.map(function(point) {
					return (
						m("div", {className:"item"}, [
							m("i", {className:"right triangle icon"}),
							m("div", {className:"content"}, [
								m("a", {className:"header"}, [point.title]),
								m("div", {className:"description"}, [point.description])
							])
						])
					);
				});
			}
			return (
				m("div", {className:"item"}, [
					m("div", {className:"header"}, [item.title]),
					m("div", {className:"content"}, [
						item.description,
						m("div", {className:"list"}, [
							subpoints
						])
					])
				])
			);
		});

		return (
			m("div", {className:"ui segment"}, [
				m("div", {className:"ui ribbon label"}, [m("h4", {className:"ui header"}, [title.toUpperCase()])]),
				m("div", {className:"ui list"}, [
					items
				])
			])
		);
	};

	return segment;
};
