/**
 * @jsx m
 */

 var EditableText = function () {
	var editableText = {};

	function onCloseEdit(config) {
		return function() {
			config.prop(config.intermediate());
			if (config.saveCallback) {
				config.saveCallback(config.intermediate());
			}
			config.isEditing = false;
		};
	}

	function onOpenEdit(config) {
		return function() {
			config.intermediate(config.prop());
			config.isEditing = true;
		};
	}

	editableText.view = function (config) {
		if (config.isEditing) {
			return (
				<span className="fluid editable-text">
					{
						m(config.type ? config.type : 'input', {
							type:"text",
							rows: 4,
							autofocus: true,
							placeholder: config.placeholder,
							value: config.intermediate(),
							onblur: onCloseEdit(config),
							onchange: m.withAttr('value', config.intermediate),
							config: function(element, isInitialized) {
								if (!isInitialized) {
									element.focus();
								}
							}
						})
					}
					<i onclick={onCloseEdit(config)} className="checkmark icon"></i>
				</span>
			);
		} else {
			return (
				<span className="fluid editable-text">
					<span onclick={onOpenEdit(config)}>
						{config.prop() ? config.prop() : config.placeholder}
						<i className="write icon"></i>
					</span>
				</span>
			);
		}
	};

	editableText.buildConfig = function(prop, placeholder, saveCallback) {
		return {prop: prop, intermediate: m.prop(''), isEditing: false, placeholder: placeholder, saveCallback: saveCallback};
	};

	return editableText;
};

module.exports = EditableText();
