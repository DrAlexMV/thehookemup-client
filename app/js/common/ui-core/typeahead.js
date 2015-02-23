/**
 * @jsx m
 */

var API = require('common/api');

var Typeahead = function (entity, state, placeholderText, numberResults) {

	var typeahead = {};


	typeahead.dropdown = m.prop();


	typeahead.getSuggestions = function (params) {
		var deferred = m.deferred();
		var stringified = jQuery.param(params);
		this.get('/search/autocomplete/' + entity + '?' + stringified).then(
			function (response) {
				if (response['results'].length == 0) {
					deferred.resolve([]);
				} else {
					deferred.resolve(response['results']);
				}
			});
		return deferred.promise;
	};

	typeahead.keyAction = function () {
		var inputValue = document.getElementById("inputValue");
		var s = inputValue.value;
		if (s != '') {
			typeahead.getSuggestions({
				text: s,
				results: numberResults
			}).then(function (results) {
				//TODO: a way to do this without using get element by id?
				typeahead.dropdown();
				if (results.length != 0) {
					typeahead.dropdown(
						m("ul", [
							results.map(function (result) {
								return [
									m("li", {
										onclick: function () {
											document.getElementById("inputValue").value = result['text'];
											state(result['text']);
											typeahead.dropdown([]);
										}
									}, [
										m("span.suggest-name", result['text']),
										m("span.suggest-description", "Popularity" + result['score'])
									])
								];
							})
						])
					);
				}
			})
		}
	};

	typeahead.view = function () {
		return (
			<div class="suggest-holder">
				<input
				id="inputValue"
				class="suggest-prompt"
				type="text"
				placeholder={placeholderText}
				onkeypress={typeahead.keyAction}
				onkeyup={typeahead.keyAction}
				onchange={m.withAttr("value", state)}
				/>
			{typeahead.dropdown()}
			</div>
			)
	};

	_.mixin(typeahead, API);
	return typeahead
};

module.exports = Typeahead;

