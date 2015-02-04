/**
 * @jsx m
 */

var CloseableMessage = require('common/ui-core/closeable-message');
var UserModel = require('model/user');
var StreamCommon = require('common/stream-common');
var DateUtils = require('common/date-utils');

var QuestionAnswerItem = function(isOwner, itemData, index) {
	var answer;

	if (!this.vm.textInputs[itemData.id()]) {
		this.vm.textInputs[itemData.id()] = m.prop('');
	}

	if (itemData.answer().length) {
		answer = itemData.answer();
	} else {
		answer = (
			<div>
				<textarea placeholder={'Answer ' + itemData.asker.firstName() + '\'s question.'}
					value={this.vm.textInputs[itemData.id()]()}
					onchange={m.withAttr('value', this.vm.textInputs[itemData.id()])}
					rows="3" />
				<div className="ui right floated tiny primary button"
					onclick={this.answer.bind(this, itemData.id(), index)}>
					Answer
				</div>
			</div>
		);
	}

	return (
		<div className="ui tertiary segment qa-segment">
			<div className="ui content">
				{ isOwner ?
					<div className="remove">
						<i className="delete icon" onclick={this.remove.bind(this, itemData.id(), index)}></i>
					</div> : null }
				<img className="ui avatar image" src={UserModel.getPicture(itemData.asker)} />
				<div className="author username">{UserModel.getName(itemData.asker)} asked</div>
				<div className="date">{DateUtils.format(itemData.date())}</div>
			
				<div className="message">
					<div className="ui internally celled grid">
						<div className="three wide right aligned column">
							<div className="title">Q</div>
						</div>
						<div className="thirteen wide mobile thirteen wide tablet eleven wide computer column">
							<div className="content">
								{itemData.question()}
							</div>
						</div>
					</div>
				</div>
				<div className="message">
					<div className="ui internally celled grid">
						<div className="three wide right aligned column">
							<div className="title">A</div>
						</div>
						<div className="thirteen wide mobile thirteen wide tablet eleven wide computer column">
							<div className="content">
								{answer}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};


var QuestionAnswer = function () {
	var questionAnswer = {};

	var vm = 
	questionAnswer.vm = {
		textInputs: {},
		questionBox: m.prop(''),
		hasPosted: m.prop(false)
	};

	questionAnswer.stream = new Bacon.Bus();

	questionAnswer.ask = function() {
		questionAnswer.stream.push(new StreamCommon.Message(
			'QuestionAnswer::Ask',
			{ ask: questionAnswer.vm.questionBox() }
		));
		questionAnswer.vm.questionBox('');
		questionAnswer.vm.hasPosted(true);
	};

	questionAnswer.answer = function(id, index) {
		questionAnswer.stream.push(new StreamCommon.Message(
			'QuestionAnswer::Answer',
			{ answer: questionAnswer.vm.textInputs[id](), id: id, index: index }
		));
		delete questionAnswer.vm.textInputs[id];
	};

	questionAnswer.remove = function(id, index) {
		questionAnswer.stream.push(new StreamCommon.Message(
			'QuestionAnswer::Remove',
			{ id: id, index: index }
		));
	};

	questionAnswer.view = function (props) {
		return (
			<div className="ui segment">
				<div className="ui header">Questions and Answers</div>
				<div className="ui divider"></div>
				{ props.qa.map(QuestionAnswerItem.bind(questionAnswer, props.isOwner)) }
				{ vm.hasPosted() ?
					<div className="ui success message" config={CloseableMessage}>
						<i className="close icon"></i>
						Your question successfully sent to the { props.startupName } team.
						You'll see it here as soon as they answer it.
					</div> : null }
				<div className="ui tertiary segment qa-segment">
					<div className="ui content ask-question">
						<textarea placeholder={'Ask ' + props.startupName + ' a question'}
							value={vm.questionBox()}
							onchange={m.withAttr('value', vm.questionBox)}
							rows="3" />
						<div className="ui button tiny blue right floated" onclick={questionAnswer.ask}>
							Ask
						</div>
					</div>
				</div>
			</div>
		);
	};

	return questionAnswer;
};

module.exports = QuestionAnswer;
