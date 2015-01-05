var PopupLabel = function(element, isInitialized) {
	if (!isInitialized) {
		$(element).popup();
	}
};

module.exports = PopupLabel;
