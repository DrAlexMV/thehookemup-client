/**
 * @jsx m
 */

var Pagination = require('common/ui-core/pagination');
var StreamCommon = require('common/stream-common');
var UserModel = require('model/user');

var Message = function (isOwner, post, postIndex) {
	return (
		<div className="ui card">
			<div className="content">
				{ isOwner ?
					<div className="ui right floated">
						<i className="delete icon" onclick={
							this.removeMessage.bind(this, postIndex, post.id())
						}></i>
					</div> : null }
				<div className="description">{post.message()}</div>
			</div>
			<div className="extra content">
				<img className="ui avatar image" src={UserModel.getPicture(post.user)} />
				<div className="right floated author">
					<div>{UserModel.getName(post.user)}</div>
					<div>{post.date()}</div>
				</div>
			</div>
		</div>
	);
};

var MessageFeed = function () {
	var messageFeed = {};

	var vm =
	messageFeed.vm = {
		pagination: Pagination(),
		messageToPost: m.prop(''),
		currentPage: m.prop(0)
	};

	// Needed because can't push to Bacon.mergeAll returned stream directly.
	var privateStream = new Bacon.Bus();
	
	messageFeed.stream = Bacon.mergeAll(vm.pagination.stream, privateStream);

	StreamCommon.on(messageFeed.stream, 'PageSelected::Pagination', function (message) {
		vm.currentPage(message.parameters.page);
	});

	var submitNew = function () {
		privateStream.push(new StreamCommon.Message(
			'MessageFeed::Post',
			{message: vm.messageToPost()}
		));
		vm.messageToPost('');
	};

	messageFeed.view = function (props) {
		// Local pagination for now. Not worth server side pagination at this point.
		// Not _that_ much wasted bandwidth even with a lot of messages.
		var messagesPerPage = 4;
		var page_start = vm.currentPage() * messagesPerPage;
		var page = props.messages.slice(page_start, page_start + messagesPerPage);

		this.removeMessage = function (index, id) {
			privateStream.push(new StreamCommon.Message(
				'MessageFeed::Remove',
				{
					index: index,
					id: id
				}
			));
		};

		var postAMessage = props.isOwner ?
			<div className="ui card">
				<div className="content">
					<div className="description">
						<textarea
							value={vm.messageToPost()}
							onchange={m.withAttr('value', vm.messageToPost)}
							placeholder={'What\'s new at ' + props.startupName + '?'}
							rows="4" />
						<div className="ui button tiny blue right floated" onclick={submitNew}>
							Submit
						</div>
					</div>
				</div>
				<div className="extra content">
					<img className="ui avatar image" src={UserModel.getPicture(props.currentUser)} />
					<div className="right floated author">
						<div>{UserModel.getName(props.currentUser)}</div>
					</div>
				</div>
			</div> : null;
		return (
			<div id="message-feed">
				{ postAMessage }
				{ page.map(Message.bind(this, props.isOwner)) }
				{ vm.pagination.view(
					vm.pagination.utils.numberOfPages(messagesPerPage, props.messages.length),
					vm.currentPage()) }
			</div>
		);
	};
	return messageFeed;
};

module.exports = MessageFeed;