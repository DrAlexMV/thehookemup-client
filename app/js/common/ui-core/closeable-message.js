var CloseableMessage = function(element, isInitialized) {
	if (!isInitialized) {
		$(element).find('.close').on('click', function() {
			$(this).closest('.message').transition('scale out');
		});
	}
};

module.exports = CloseableMessage;
