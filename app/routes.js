'use strict';

m.route(document.getElementById('app'), '/', {
	'/': auth,
	'/profile': profile,
});
