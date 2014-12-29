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