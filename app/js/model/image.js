var API = require('common/api');

var Image = function(API) {
	var image = {};

	image.postURL = function() {
		return API.calcAddress('/images');
	};

	image.uploadFromURI = function (uri) {
		return this.post('/images/upload-from-uri', {uri: uri});
	};

	image.getURL = function(imageName) {
		return API.calcAddress('/images/' + imageName);
	};

	image.deleteImage = function(imageName) {
		return this.delete('/images/' + imageName);
	};

	// Function provides fallback in event of null image path
	image.getSource = function(imageName) {
		return imageName ? image.getURL(imageName) : '/img/square-image.png';
	};

	_.mixin(image, API);
	return image;
};

module.exports = Image(API);
