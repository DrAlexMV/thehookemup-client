var HandleEditor = function (handleName) {
    var handleEditor = {};

    var availableHandles = {
        facebook: { icon: 'facebook', tag: 'Facebook', tagClass: 'facebook' },
        twitter: { icon: 'twitter', tag: 'Twitter', tagClass: 'twitter' },
        website: { icon: 'browser', tag: 'Website' },
        linkedin: {icon: 'linkedin', tag: 'Linkedin', tagClass: 'linkedin'},
        github: { icon: 'github', tag: 'Github', tagClass: 'github'},
        'google-plus': {icon: 'google plus', tag:'Google Plus', tagClass:'google-plus'},
        'angel-list': { tag: 'Angel List', tagClass: 'angel-list' },
        default: { tag: handleName }
    };


    handleEditor.view = function (ctrl) {

        var handle = availableHandles[handleName] ? availableHandles[handleName] : availableHandles.default;

        ctrl.type(handleName);

        return [
            m('div.ui.right.labeled.left.icon.input', [
                m('i.icon', { class: handle.icon }),
                m('input[type="text"]', { onchange: m.withAttr('value', ctrl.url) }),
                m('div.ui.tag.label', { class: handle.tagClass }, [
                    handle.tag
                ])
            ])
        ];
    };

    return handleEditor;
};

module.exports = HandleEditor;