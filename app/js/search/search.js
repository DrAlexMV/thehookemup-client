/**
 * Provides search page
 * @jsx m
 */

var Error = require('common/error');
var User = require('model/user');
var FormBuilder = require('common/form-builder');
var SearchFilterForm = require('search/search-filter-form');

var search = {};

search.vm = {
	init: function () {
		this.query = m.route.param('query');
		var results = [{
			"_id": m.prop("54a21dfc983fe41d6baf4d79"), 
			"dateJoined": m.prop("2014-12-30 03:37:32.414000"), 
			"description": m.prop("developer"), 
			"email": m.prop("nicholas.sundin@utexas.edu"), 
			"error": m.prop(null), 
			"firstName": m.prop("Nick"), 
			"graduationYear": m.prop(null), 
			"lastName": m.prop("Sundin"), 
			"major": m.prop(null), 
			"picture": m.prop(null), 
			"role": m.prop("Evil Twin"), 
			"university": m.prop(null)
		}, 
		{
			"_id": m.prop("54a2b332983fe42519c377a8"), 
			"dateJoined": m.prop("2014-12-30 14:14:10.112000"), 
			"description": m.prop("Man who likes to partake in the finer things in life."), 
			"email": m.prop("drawwwlax@foo.edu"), 
			"error": m.prop(null), 
			"firstName": m.prop("Alex"), 
			"graduationYear": m.prop(null), 
			"lastName": m.prop("Ventura"), 
			"major": m.prop(null), 
			"picture": m.prop(null), 
			"role": m.prop("Cyborg"), 
			"university": m.prop(null)
		},
		{
			"_id": m.prop("54a2b332983fe42519c377a8"), 
			"dateJoined": m.prop("2014-12-30 14:14:10.112000"), 
			"description": m.prop("Man who likes to partake in the finer things in life."), 
			"email": m.prop("drawwwlax@foo.edu"), 
			"error": m.prop(null), 
			"firstName": m.prop("Austin"), 
			"graduationYear": m.prop(null), 
			"lastName": m.prop("Stone"), 
			"major": m.prop(null), 
			"picture": m.prop(null), 
			"role": m.prop("Visionary"), 
			"university": m.prop(null)
		},
		{
			"_id": m.prop("54a2b332983fe42519c377a8"), 
			"dateJoined": m.prop("2014-12-30 14:14:10.112000"), 
			"description": m.prop("Man who likes to partake in the finer things in life."), 
			"email": m.prop("drawwwlax@foo.edu"), 
			"error": m.prop(null), 
			"firstName": m.prop("Austin"), 
			"graduationYear": m.prop(null), 
			"lastName": m.prop("Ventura"), 
			"major": m.prop(null), 
			"picture": m.prop(null), 
			"role": m.prop("Artist"), 
			"university": m.prop(null)
		}];

		// make this fake data really huge
		this.results = results.concat(results, results, results, results);
	}
};

search.controller = function () {
	search.vm.init();
};

search.view = function () {
	var vm = search.vm;
	var resultItems = search.vm.results.map(function(item) {
		return (
			<div className="item">
				<div className="ui tiny image">
					<img src={User.getPicture(item)} />
				</div>
				<div className="content">
					<a className="header">{User.getName(item)}</a>
					<div className="meta">
						<a>{item.role()}</a>
					</div>
					<div className="description">
						{item.description()}
					</div>
				</div>
			</div>
		);
	});
	return (
		<div className="base ui padded stackable grid">
			<div className="row">
				<div className="four wide column"></div>
				<div className="ten wide column">
					<h2 className="ui header">
						Search - &quot;{search.vm.query}&quot;
					</h2>
				</div>
				<div className="two wide column"></div>
			</div>
			<div className="row">
				<div className="four wide column">
					<div className="ui segment">
						<h4>Refine Search</h4>
						{ (new SearchFilterForm()).view({}) }
					</div>
				</div>
				<div className="ten wide column">
					<div className="ui segment">
						<div className="ui relaxed divided items">
							{resultItems}
						</div>
					</div>
				</div>
				<div className="two wide column"></div>
			</div>
		</div>
	);
};

module.exports = search;
