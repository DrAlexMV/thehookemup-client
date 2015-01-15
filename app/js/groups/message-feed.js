var testMessages = [
	{ user: { name: 'Alexander Ventura' }, text: 'Think differently.' },
	{ user: { name: 'Austin Stone' }, text: 'Poop.' },
];

var Message = function (user, text) {
	return [
		m('div.ui.card', [
			m('div.content', [
				m('div.header', user.name),
				m('div.description', text)
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
			testMessages.map(function (message) {
				return Message(message.user, message.text)
			})
		];
	};

	return messageFeed;
};

module.exports = MessageFeed;