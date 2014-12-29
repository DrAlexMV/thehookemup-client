/**
 * @jsx m
 */

profile.ContactCard = function (user_image_url, social_links) {
	var card = {};
	card.view = function () {
		return (
			m("div", {className:"ui card"}, [
				m("div", {className:"image"}, [
					m("img", {src:user_image_url} )
				]),
				m("div", {className:"content"}, [
					m("h4", {className:"ui header"}, ["Developer"]),
					m("div", {className:"ui divider"}),
					m("div", {className:"ui circular linkedin icon button"}, [
						m("i", {className:"linkedin icon"})
					]),
					m("div", {className:"ui circular github icon button"}, [
						m("i", {className:"github icon"})
					]),
					m("div", {className:"ui circular facebook icon button"}, [
						m("i", {className:"facebook icon"})
					]),
					m("div", {className:"ui circular twitter icon button"}, [
						m("i", {className:"twitter icon"})
					]),
					m("div", {className:"ui circular google plus icon button"}, [
						m("i", {className:"google plus icon"})
					])
				])
			])
		);
	};

	return card;
};
