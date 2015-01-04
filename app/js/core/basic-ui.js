var basicUI = {};

basicUI.PopupLabel = function(element, isInitialized) {
	if (!isInitialized) {
		$(element).popup();
	}
}

module.exports = basicUI;
