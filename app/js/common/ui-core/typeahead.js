/**
 * @jsx m
 */

var API = require('common/api');

var Typeahead = function (entity, state, placeholderText, numberResults) {

	var typeahead = {};

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
				//TODO: a way to do this without jquery?
				suggestHolder = $('.suggest-holder ul');
				suggestHolder.empty();
				if (results.length == 0) {
					suggestHolder.hide();
				} else {
					for (var i in results) {
						suggestHolder.append($("<li><span class='suggest-name'>" + results[i]['text'] +
							"</span><span class='suggest-description'>" + "Popularity: " +
							results[i]['score'] + "</span></li>"));
					}
					$('.suggest-holder li').on('click', function(){
						var selectedValue = $(this).find('.suggest-name').html();
						document.getElementById("inputValue").value=selectedValue;
						state(selectedValue);
						suggestHolder.hide();
					});
					suggestHolder.show();
				}
			})
		}
	};

	typeahead.view = function () {
		return (
			<div class = "suggest-holder">
				<input
				id="inputValue"
				class="suggest-prompt"
				type="text"
				placeholder={placeholderText}
				onkeypress={typeahead.keyAction}
				onkeyup={typeahead.keyAction}
				onchange={m.withAttr("value", state)}
				/>
				<ul></ul>
			</div>
			)
	};

	_.mixin(typeahead, API);
	return typeahead
};

module.exports = Typeahead;

