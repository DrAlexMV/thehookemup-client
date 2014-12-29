(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var auth = require('auth/auth');
var profile = require('profile/profile');

m.route(document.getElementById('app'), '/', {
	'/': auth,
	'/profile': profile,
});

},{"auth/auth":2,"profile/profile":11}],2:[function(require,module,exports){
var LoginForm = require('auth/login-form');
var RegistrationForm = require('auth/registration-form');
var SocialSignInForm = require('auth/social-signIn-form');
var StreamCommon = require('common/stream-common');

var auth = {};

auth.User = function () {
	this.isAuthenticated =  m.prop(false);
};


auth.vm = {
	init: function () {
		/* Child Components */
		this.loginForm =  new LoginForm();
		this.socialSignInForm = new SocialSignInForm();
		this.registrationForm = new RegistrationForm();

		/* VM State Variables */
		this.awaitingResponse = m.prop(false);
		this.userRegistering = m.prop(false);

		/* Message Passing Stream */
		this.stream = Bacon.mergeAll(this.loginForm.stream, this.socialSignInForm.stream, this.registrationForm.stream);

		StreamCommon.on(this.stream, 'LoginForm::SignIn', function () {
			auth.vm.awaitingResponse(true);
		});

		StreamCommon.on(this.stream, ['LoginForm::Register', 'RegistrationForm::Back'], function (event) {
			auth.vm.userRegistering(event.name === 'LoginForm::Register');
		});

		StreamCommon.on(this.stream, 'RegistrationForm::Register', function () {
			auth.vm.awaitingResponse(true);
		});
	}
};

auth.controller = function () {
	auth.vm.init();
};

auth.view = function () {
	var vm = auth.vm;

	var signInForms = function () {
		return [
			m('div.ui.two.column.grid', [
				m('div.column', [
					vm.socialSignInForm.view({})
				]),
				m('div.column', [
					vm.loginForm.view({})
				])
			])
		]
	};

	return [
		m('div.ui.three.column.stackable.page.grid', [
			m('div.three.wide.column'),
			m('div.ten.wide.column', { style: { 'padding-top': '200px'} }, [
				m('div.ui.piled.segment#auth-segment', [
					m('div', [
						vm.awaitingResponse() ? m('div.ui.active.inverted.dimmer', [m('div.ui.text.loader', 'Loading')]) : null,
					]),
					m('h1.ui.center.aligned.header', [
						m('img', { src: 'img/logo.png' } )
					]),
					m('div.ui.clearing.divider'),
					vm.userRegistering() ? vm.registrationForm.view() : signInForms()
				])
			]),
			m('div.three.wide.column')
		]
	)];
};

module.exports = auth;

},{"auth/login-form":3,"auth/registration-form":4,"auth/social-signIn-form":5,"common/stream-common":7}],3:[function(require,module,exports){
var StreamCommon = require('common/stream-common');

var LoginForm = function () {
	var loginForm = {};

	var vm =
	loginForm.vm = {
		email: m.prop(''),
		password: m.prop('')
	};

	loginForm.stream = new Bacon.Bus();

	function register(event) {
		loginForm.stream.push(new StreamCommon.Message('LoginForm::Register', {}));
	}

	function signIn(event) {
		loginForm.stream.push(new StreamCommon.Message('LoginForm::SignIn', { email: vm.email(), password: vm.password() }));
	}

	loginForm.view = function () {
		return [
			m('form.ui.form', [
				m('div.required.field', [
					m('div.ui.icon.input', [
						m('input', { placeholder: 'Email', type: 'text', onchange: m.withAttr('value', vm.email) }),
						m('i.user.icon')
					])
				]),
				m('div.required.field', [
					m('div.ui.icon.input', [
						m('input', { placeholder: 'Password', type: 'password', onchange: m.withAttr('value', vm.password) }),
						m('i.lock.icon')
					])
				]),
				m('div.ui.right.floated.buttons', [
					m('div.ui.button.primary', { onclick: register }, 'Register'),
					m('.or'),
					m('div.ui.button.positive', { onclick: signIn } , 'Sign In')
				])
			])
		];
	};

	return loginForm;
};

module.exports = LoginForm;

},{"common/stream-common":7}],4:[function(require,module,exports){
var FormBuilder = require('common/form-builder');
var StreamCommon = require('common/stream-common');

var RegistrationForm = function () {
	var registrationForm = {};

	registrationForm.vm = {
		firstName: m.prop(''),
		lastName: m.prop(''),
		email: m.prop(''),
		password: m.prop(''),
		roles: m.prop([]),
		displayWarning: m.prop(false)
	};

	registrationForm.stream = new Bacon.Bus();

	function register() {
		registrationForm.stream.push(new StreamCommon.Message('RegistrationForm::Register'));
	}

	function back() {
		registrationForm.stream.push(new StreamCommon.Message('RegistrationForm::Back'));
	}
	
	registrationForm.view = function () {
		var vm = registrationForm.vm;

		function validate(element, isInitialized) {
			$(element).form({

			});
		}

		var nameFields = [
			{ name: 'First Name',
				parameters: { name: 'first-name', placeholder: 'First Name', onchange: m.withAttr('value', vm.firstName) } },
			{ name: 'Last Name',
				parameters: { name: 'last-name', placeholder: 'Last Name', onchange: m.withAttr('value', vm.lastName) } }
		];

		var emailPasswordFields = [
			{ name: 'Email',
				parameters: { name: 'email', placeholder: 'Email', onchange: m.withAttr('value', vm.email) } },
			{ name: 'Password',
				parameters: { name: 'password', placeholder: 'Password', onchange: m.withAttr('value', vm.password), type: 'password' } }
		];

		return [
			m('form.ui.form', { class: vm.displayWarning() ? 'warning' : '', config: validate }, [
				m('div.ui.warning', [
					m('div.ui.warning.message', [
						m('div.header', 'Oops!'),
						m('ul.list', [])
					])
				]),
				m('div.two.fields', [
					nameFields.map(function (field) { return FormBuilder.inputs.formField(field.name, field.parameters, field.width); })
				]),
				emailPasswordFields.map(function (field) { return FormBuilder.inputs.formField(field.name, field.parameters) }),
				m('div.ui.negative.button', { onclick: back }, 'Back'),
				m('div.ui.right.floated.buttons', [
					m('div.ui.positive.button', { onclick: register }, 'Register')
				])
			])
		]
	};

	return registrationForm;
};

module.exports = RegistrationForm;


},{"common/form-builder":6,"common/stream-common":7}],5:[function(require,module,exports){
var SocialSignInForm = function () {
	var socialSignInForm = {};

	socialSignInForm.vm = {

	};

	socialSignInForm.stream = new Bacon.Bus();

	socialSignInForm.view = function () {
		return [
			m('form.socialSignInForm.ui.form', [
				m('div.ui.one.column.grid', [
					m('div.column', [
						m('div.grouped.fields', [
							m('div.ui.facebook.button', [
								m('i.facebook.icon'),
								'Sign up with Facebook'
							])
						]),
						m('div.grouped.fields', [
							m('div.ui.twitter.button', [
								m('i.twitter.icon'),
								'Sign up with Twitter'
							])
						]),
						m('div.grouped.fields', [
							m('div.ui.google.plus.button', [
								m('i.google.plus.icon'),
								'Sign up with Google Plus'
							])
						])
					])
				])
			])
		]
	};

	return socialSignInForm;
};

module.exports = SocialSignInForm;

},{}],6:[function(require,module,exports){
var FormBuilder = (function () {

	var formBuilder = {
		inputs: {
			formField: function (name, parameters, width) {
				return [
					m('div.required.field', { class: width ? width + ' wide' : '' }, [
						m('label', name),
						m('input', parameters)
					])
				];
			}
		}
	};

	return formBuilder;
})();

module.exports = FormBuilder;
},{}],7:[function(require,module,exports){
var StreamCommon = {

	/**
	 * Helper function to filter out events in a stream with a given name
	 *
	 * @param stream
	 * @param eventName
	 * @param cb
	 * @returns {*}
	 */
	on: function (stream, messageNames, cb) {
		return stream.filter(function (message) {
			if (Array.isArray(messageNames)) {
				return messageNames.indexOf(message.name) > -1;
			}
			return message.name === messageNames;
		}).onValue(cb);
	},

	/**
	 * Message object for message passing using BaconJS Bus
	 *
	 * @param name
	 * @param parameters
	 * @constructor
	 */
	Message: function (name, parameters) {
		this.name = name ? name : 'UNNAMED';
		this.parameters = parameters ? parameters : {};
	}
};

module.exports = StreamCommon;

},{}],8:[function(require,module,exports){
/**
 * @jsx m
 */

var ContactCard = function (user_image_url, social_links) {
	var card = {};
	card.view = function () {
		return (
			m("div", {className:"ui card"}, [
				m("div", {className:"image"}, [
					m("img", {src:user_image_url} )
				]),
				m("div", {className:"content"}, [
					m("h4", {className:"ui header"}, ["Developer"]),
					m("div", {className:"ui divider"}),
					m("div", {className:"ui circular linkedin icon button"}, [
						m("i", {className:"linkedin icon"})
					]),
					m("div", {className:"ui circular github icon button"}, [
						m("i", {className:"github icon"})
					]),
					m("div", {className:"ui circular facebook icon button"}, [
						m("i", {className:"facebook icon"})
					]),
					m("div", {className:"ui circular twitter icon button"}, [
						m("i", {className:"twitter icon"})
					]),
					m("div", {className:"ui circular google plus icon button"}, [
						m("i", {className:"google plus icon"})
					])
				])
			])
		);
	};

	return card;
};

module.exports = ContactCard;

},{}],9:[function(require,module,exports){
/**
 * Generic self-loading list of entities
 * @jsx m
 */

var EntityList = function (title, entity_ids) {
	var entitylist = {};
	entitylist.view = function () {
		return (
			m("div", [
				m("h4", {className:"header"}, ["Connections"]),
				m("div", {className:"ui divided very relaxed list"}, [
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Alexander Ventura"]),
							"Developer"
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Brandon Olivier"]),
							"Developer"
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Austin Stone"]),
							"Developer"
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Santa Claus"]),
							"Investor"
						])
					])
				]),
				m("h4", {className:"header"}, ["Associations"]),
				m("div", {className:"ui divided very relaxed list"}, [
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["UT Alum Web App Jobs"])
						])
					]),
					m("a", {className:"item"}, [
						m("img", {className:"ui top aligned avatar image", src:"/img/square-image.png"} ),
						m("div", {className:"content"}, [
							m("div", {className:"header"}, ["Computer Science Hackers"])
						])
					])
				])
			])
		);
	};

	return entitylist;
};

module.exports = EntityList;

},{}],10:[function(require,module,exports){
/**
 * @jsx m
 */

var InfoSegment = function (title, content) {
	var segment = {};
	segment.view = function () {
		var items = content.map(function(item) {
			var subpoints = null;
			if (item.subpoints) {
				subpoints = item.subpoints.map(function(point) {
					return (
						m("div", {className:"item"}, [
							m("i", {className:"right triangle icon"}),
							m("div", {className:"content"}, [
								m("a", {className:"header"}, [point.title]),
								m("div", {className:"description"}, [point.description])
							])
						])
					);
				});
			}
			return (
				m("div", {className:"item"}, [
					m("div", {className:"header"}, [item.title]),
					m("div", {className:"content"}, [
						item.description,
						m("div", {className:"list"}, [
							subpoints
						])
					])
				])
			);
		});

		return (
			m("div", {className:"ui segment"}, [
				m("div", {className:"ui ribbon label"}, [m("h4", {className:"ui header"}, [title.toUpperCase()])]),
				m("div", {className:"ui list"}, [
					items
				])
			])
		);
	};

	return segment;
};

module.exports = InfoSegment;

},{}],11:[function(require,module,exports){
/**
 * Provides profile page
 * @jsx m
 */

var ContactCard = require('profile/contact-card');
var EntityList = require('profile/entity-list');
var InfoSegment = require('profile/info-segment');

var profile = {};

profile.vm = {
	init: function () {
		// Mock immutable user data. TODO: pull from server.
		this.basicInfo = {
			name: 'Nicholas Sundin',
			graduation_year: 2016,
			major: 'B.S. Computer Science',
			description: 'Hacker who likes to burn the midnight oil as he discovers and tries out new ideas and technologies.',
			university: 'University of Texas',
		};

		/*
		 * Details could be a recursive structure, but explicitly limiting to
		 * two levels of detail to avoid possible buffer-overflow and
		 * design-overflow issues.
		 */
		this.details = [
			{
				title: 'skills',
				content: 
				[
					{
						title: 'Programming',
						description: 'Over a decade of experience',
						subpoints: [
							{
								title: 'Python',
								description: '10 years of network, threaded, graphic programming',
							},
							{
								title: 'C++',
								description: '6 years. OpenGL, wxWidgets',
							},
						],
					},
					{
						title: 'Eating Food',
						description: '20 years \'o this'
					},
				],
			},
			{
				title: 'interests',
				content: [
					{
						title: 'Repurposing consumer technology',
						description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
						subpoints: [
							{
								title: 'Banana Phone',
								description: 'Hack made with 2/3rds of an iPhone 8 and an overly-ripe banana',
							},
						],
					},
				],
			},
			{
				title: 'projects',
				content: [
					{
						title: 'Hook \'em up',
						description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
					},
				],
			},
		];

		this.edges = {
			connections: [2, 3, 4, 5],
			associations: [6, 7],
		};

		this.connections = new EntityList('Connections', this.edges.connections);


	}
};

profile.controller = function () {
	profile.vm.init();
};

profile.view = function () {
	var vm = profile.vm;
	var contact_card = new ContactCard('/img/self-small.jpg', {});

	var segments = vm.details.map(function(entry) {
		return new InfoSegment(entry.title, entry.content).view({});
	});

	var associations = null;

	var university_insignia = (vm.basicInfo.university === 'University of Texas') ? 
		m("img", {src:"/img/bevo_icon.jpg", id:"bevo_icon"} )
		: null;

	return (
		m("div", {className:"base ui padded stackable grid"}, [
			m("div", {className:"row"}, [
				m("div", {className:"four wide column"}, [
					contact_card.view({})
				]),
				m("div", {className:"eight wide column"}, [
					m("h1", {className:"ui header"}, [
						vm.basicInfo.name,
						m("div", {className:"blue ui buttons right floated"}, [
							m("div", {className:"ui button"}, [
								m("i", {className:"mail icon"}),
								"Mail"
							]),
							m("div", {className:"ui positive button"}, [
								m("i", {className:"share alternate icon"}),
								"Connect"
							])
						])
					]),
					university_insignia,
					m("h5", {className:"university-title header"}, [
					m("i", [
						vm.basicInfo.university, " class of '",
						vm.basicInfo.graduation_year % 1000,
						m("br"),
						vm.basicInfo.major
					])
					]),
					m("div", {className:"description"}, [
						vm.basicInfo.description
					]),
					segments
				]),
				m("div", {className:"four wide column"}, [
					vm.connections.view({}),
					associations
				])
			])
		])
	);
};

module.exports = profile;

},{"profile/contact-card":8,"profile/entity-list":9,"profile/info-segment":10}]},{},[1])