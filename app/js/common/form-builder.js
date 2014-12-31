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