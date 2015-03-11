var Constants = {
	ENTER_KEY: 13,
	availableRoles: ['Founder', 'Investor', 'Builder'],

	userHandles: {
		'blog': { name: 'LinkedIn', icon: 'linkedin', url: m.prop(), type: 'linkedin'},
		'twitter': { name: 'Github', icon: 'github', url: m.prop(), type: 'github' },
		'angel-list': { name: 'Angel List', icon: 'angellist', url: m.prop(), type:'angellist' },
		'facebook': { name: 'Facebook', icon: 'facebook', url: m.prop(), type:'facebook'},
		'google-plus':{ name: 'Google Plus', icon:'googleplus', url: m.prop(), type: 'googleplus'},
		'github': { name: 'Github', icon: 'github', url: m.prop(), type: 'github'}
	},

	startupHandles: {
		'blog': { name: 'LinkedIn', icon: 'linkedin', url: m.prop(), type: 'linkedin' },
		'twitter': { name: 'Github', icon: 'github', url: m.prop(), type: 'github' },
		'angel-list': { name: 'Angel List', icon: 'angellist', url: m.prop(), type:'angellist' },
		'facebook': { name: 'Facebook', icon: 'facebook', url: m.prop(), type:'facebook'}
	}
};

module.exports = Constants;