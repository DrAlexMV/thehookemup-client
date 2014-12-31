var FormBuilder = (function () {

	var formBuilder = {
		inputs: {
			formField: function (name, parameters, width) {
				return [
					m('div.required.field', { class: width ? width + ' wide' : '' }, [
						m('label', name),
						m('input', _.extend({ name: name }, parameters))
					])
				];
			},
			checkbox: function (name, parameters, label) {
				var checkboxConfig = function (element, isInitialized) {
					if (!isInitialized) { $(element).checkbox(); }
				};

				return [
					m('div.ui.checkbox' , { config: checkboxConfig }, [
						m('input', _.extend({ type: 'checkbox' }, parameters)),
						m('label', label)
					])
				];
			},
			multiCheckbox: function () {

			},
			dropzone: function (id, settings) {
				var config = function (element, isInitialized) {
					if (!isInitialized) {
						new Dropzone(element, settings);
					}
				};

				return [
					m('div.dropzone', { id: id, config: config })
				];
			}
		},

		validate: function (rules, onSuccess, onFailure) {
			var wrap = function (fn) {
				return function (args) {
					m.startComputation();
					fn(args);
					m.endComputation();
					return false;
				}
			};

			return function (element, isInitialized) {
				var el = $(element);

				if (!isInitialized) {
					el.form(rules, { onSuccess: wrap(onSuccess), onFailure: wrap(onFailure) });
				}
			}
		}
	};

	return formBuilder;
})();

module.exports = FormBuilder;