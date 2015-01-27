/**
 * @jsx m
 */

var HorizontalEntityListSegment = require('dashboard/horizontal-entity-list-segment');
var User = require('model/user');

var StartupFounders = function () {
	var startupFounders = {};

	var vm = {
	};

	startupFounders.view = function (config) {
		return (
			<div className="ui segment">
				<div className="ui header">Founders</div>
				<div className="ui divider"></div>
					{
						HorizontalEntityListSegment(
							'',
							'/profile',
							function() {
								return config.people;
							},
							User,
							{}
						).view()
					}
			</div>
		);
	};

	return startupFounders;
};

module.exports = StartupFounders;
