var API = require('common/api');
var StreamCommon = require('common/stream-common');

var FormBuilder = (function () {

	var formBuilder = {
		inputs: {
			formField: function (parameters, name, width, type) {
				var defaultName = name ? name.toLowerCase() : null;
				parameters.name = parameters.name ? parameters.name : defaultName;
				var required = typeof parameters.required != 'undefined' ? parameters.required : true;
				if (required) {
					return [
						m('div.required.field', { class: width ? width + ' wide' : '' }, [
							name ? m('label', name) : null,
							m(type ? type : 'input', parameters)
						])
					];
				} else {
					return  [
						m('div.field', { class: width ? width + ' wide' : '' }, [
							name ? m('label', name) : null,
							m(type ? type : 'input', parameters)
						])
					];
				}
			},
			checkbox: function (label, parameters) {
				var checkboxConfig = function (element, isInitialized) {
					if (!isInitialized) {
						$(element).checkbox();
					}
				};

				parameters.name = parameters.name ?
					parameters.name : label.toLowerCase() + '-checkbox';

				return [
					m('div.ui.checkbox', { config: checkboxConfig }, [
						m('input[type="checkbox"]', parameters),
						m('label', label)
					])
				];
			},
			dropzone: function (id, settings, stream) {
				var config = function (element, isInitialized) {
					if (!isInitialized) {
						new Dropzone(element, settings);
					}
				};

				Dropzone.options[id] = {
					init: function () {
						this.options.withCredentials = true;
						if (stream) {
							this.on('success', function (file) {
								stream.push(
									new StreamCommon.Message(
										'Dropzone::Success',
										JSON.parse(file.xhr.response))
								);
							});
						}
					}
				};

				return [
					m('div.dropzone', {id: id, config: config})
				];
			},
			editable: function (textProp, settings) {
				var config = function (element, isInitialized) {
					if (!isInitialized) {
						settings.success = function (response, newValue) {
							textProp(newValue);
						}
						settings.mode = 'inline';
						$(element).editable(settings);
					}
				};
				return config;
			},
			localSearch: function (settings) {
				return function (element, isInitialized) {
					if (!isInitialized) {
						$(element).search(settings);
					}
				};
			}
		},
		validate: function (rules, onSuccess, onFailure) {
			var wrap = function (fn) {
				return function (args) {
					m.startComputation();
					_.isFunction(fn) && fn(args);
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