var API = require('common/api');

var Image = function(API) {
	var image = {};

	image.postURL = function() {
		return API.calcAddress('/image');
	};

	image.getURL = function(imageName) {
		return API.calcAddress('/image/' + imageName);
	};

	image.deleteImage = function(imageName) {
		return this.delete('/image/' + imageName);
	};

	// Function provides fallback in event of null image path
	image.getSource = function(imageName) {
		return imageName ? image.getURL(imageName) : '/img/square-image.png';
	};

	_.mixin(image, API);
	return image;
};

module.exports = Image(API);
