/**
 * @jsx m
 */

var QuestionAnswer = function () {
	var questionAnswer = {};

	var vm = {

	};

	questionAnswer.view = function () {
		return (
			<div className="ui segment">
				<div className="ui header">Questions and Answers</div>
				<div className="ui divider"></div>
			</div>
		);
	};

	return questionAnswer;
};

module.exports = QuestionAnswer;
