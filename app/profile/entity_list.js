/**
 * Generic self-loading list of entities
 * @jsx m
 */

profile.EntityList = function (title, entity_ids) {
	var entitylist = {};
	entitylist.view = function () {
		return (
			m("div", [
				m("h4", {className:"header"}, ["Connections"]),
				m("div", {className:"ui divided very relaxed list"}, [
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Alexander Ventura"]),
							"Developer"
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Brandon Olivier"]),
							"Developer"
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Austin Stone"]),
							"Developer"
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Santa Claus"]),
							"Investor"
						])
					])
				]),
				m("h4", {className:"header"}, ["Associations"]),
				m("div", {className:"ui divided very relaxed list"}, [
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["UT Alum Web App Jobs"])
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Computer Science Hackers"])
						])
					])
				])
			])
		);
	};

	return entitylist;
};
