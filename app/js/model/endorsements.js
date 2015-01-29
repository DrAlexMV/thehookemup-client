var API = require('common/api');

var Endorsements = function () {
	var endorsements = {};

	endorsements.model = function () {
		var model = {};

		model.entityType = m.prop('');
		model.endorsees = m.prop([]);
		model.endorsers = m.prop([]);

		return model;
	};

	endorsements.countModel = function () {
		var model = {};

		model.endorsees = m.prop(0);
		model.endorsers = m.prop(0);

		return model;
	};

	endorsements.getEntityEndorsements = function (entityId) {
		endorsements.get('/endorsement/' + entityId, endorsements.model);
	};

	endorsements.getEntityEndorsementCount = function (entityId) {
		return endorsements.get('/endorsement/' + entityId + '/count', endorsements.countModel);
	};

	endorsements.endorseEntity = function (entityId, entityType) {
		return endorsements.post('/endorsement/me', { id: entityId, entityType: entityType });
	};

	endorsements.hasUserEndorsedEntity = function (entityId) {
		return endorsements.get('/endorsement/me/' + entityId);
	};

	endorsements.removeEndorsement = function (entityId) {
		return endorsements.delete('/endorsement/me/' + entityId);
	};

	_.mixin(endorsements, API);
	return endorsements;
};

module.exports = Endorsements;