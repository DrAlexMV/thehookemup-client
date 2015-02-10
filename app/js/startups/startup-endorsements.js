/**
 * @jsx m
 */

var EndorserList = require('engagement/Endorsements/endorser-list');

var StartupEndorsements = function (startupId) {
	var startupEndorsements = {};
	var vm = {
		endorserList: EndorserList(startupId)
	};

	startupEndorsements.view = function () {
		return (
			<div className="ui segment">
				<div className="ui header">Endorsements</div>
				<div className="ui divider"></div>
					{ vm.endorserList.view({}) }
			</div>
		);
	};

	return startupEndorsements;
};

module.exports = StartupEndorsements;
