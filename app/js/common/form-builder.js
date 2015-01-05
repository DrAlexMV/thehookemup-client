var API = require('common/api');
var StreamCommon = require('common/stream-common');

var FormBuilder = (function () {

	var formBuilder = {
		inputs: {
			formField: function (parameters, name, width) {
				var defaultName = name ? name.toLowerCase() : null;
				parameters.name = parameters.name ? parameters.name : defaultName;

				return [
					m('div.required.field', { class: width ? width + ' wide' : '' }, [
						name ? m('label', name) : null,
						m('input', parameters)
					])
				];
			},
			checkbox: function (label, parameters) {
				var checkboxConfig = function (element, isInitialized) {
					if (!isInitialized) { $(element).checkbox(); }
				};

				parameters.name = parameters.name ?
					parameters.name : label.toLowerCase() + '-checkbox';

				return [
					m('div.ui.checkbox' , { config: checkboxConfig }, [
						m('input[type="checkbox"]', parameters),
						m('label', label)
					])
				];
			},
			multiCheckbox: function (fields, bind) {
				var multi = {};

				var vm =
				multi.vm = {
				};

				multi.view = function () {
					return [
						fields.map(function (field) {
							formBuilder.inputs.checkbox(field, {});
						})
					];
				};

				return multi;
			},
			dropzone: function (id, settings, stream) {
				var config = function (element, isInitialized) {
					if (!isInitialized) {
						new Dropzone(element, settings);
					}
				};

				Dropzone.options[id] = {
					init: function() {
						this.options.withCredentials = true;
						if (stream) {
							this.on('success', function(file) {
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