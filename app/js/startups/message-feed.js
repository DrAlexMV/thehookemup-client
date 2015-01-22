var testMessages = [
	{ user: { name: 'Alexander Ventura' }, text: 'Think differently.' },
	{ user: { name: 'Austin Stone' }, text: 'Poop.' },
	{ user: { name: 'Austin Stone' }, text: 'Poop.' },
];

var Message = function (user, text) {
	return [
		m('div.ui.card', [
			m('div.content', [
				m('div.description', text),
			]),
			m('div.extra.content', [
				m('img.ui.avatar.image', { src: '' }),
				m('div.right.floated.author', [
					m('div', user.name)
				])
			])
		])
	]
};

var MessageFeed = function () {
	var messageFeed = {};

	var vm =
	messageFeed.vm = {

	};

	messageFeed.stream = new Bacon.Bus();

	messageFeed.view = function () {
		return [
			m('div#message-feed', [
				testMessages.map(function (message) {
					return Message(message.user, message.text)
				})
			])
		];
	};

	return messageFeed;
};

module.exports = MessageFeed;