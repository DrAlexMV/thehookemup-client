var autocompleteResults = require('model/autocomplete-results');

var Typeahead = function (entity, stateProp, onClickCB) {

	var typeahead = {};

	typeahead.dropdown = m.prop();

	typeahead.updateDropdown = function (text) {
		if (text) {
			autocompleteResults.getSuggestions(entity, {
				text: text,
				results: 5
			}).then(function (results) {
				if (results.length) {
					typeahead.dropdown(
						m("ul", [
							results.map(function (result) {
								return [
									m("li", {
										onclick: function () {
											stateProp(result['text']);
											onClickCB();
										}
									}, [
										m("span.suggest-name", result['text']),
										m("span.suggest-description", "Popularity: " + result['score'])
									])
								];
							})
						])
					);
				}
			})
		} else {
			typeahead.clearDropdown();
		}
	};

	typeahead.clearDropdown = function () {
		typeahead.dropdown([]);
		m.redraw();
	};

	typeahead.view = function () {
		return typeahead.dropdown();
	};


	return typeahead
};

module.exports = Typeahead;

