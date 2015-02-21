var API = require('common/api');
var EditableImage = require('common/editable-image');

var ContactCard = function (basicUserInfo, editable) {
    var card = {};

    var findWebsiteUrl = function (websiteName) {
        var handle = _.find(basicUserInfo().handles(), function (entry) {
            return (entry.type == websiteName);
        });
        return handle ? handle.url : null;
    };

    card.vm = {
        profilePicture: new EditableImage()
    };

    var desiredHandles = ['linkedin', 'github', 'facebook', 'twitter', 'google plus'];

    card.view = function () {

        var handlesView = _.map(desiredHandles, function (handle) {
            var handleUrl = findWebsiteUrl(handle);
            return handleUrl ? [
                m('div.ui.circular.' + handle.replace(' ', '.') + '.icon.button', { onclick: function () {
                    location.href = 'http://' + handleUrl }}, [
                    m('i.' + handle.replace(' ', '.') + '.icon')
                ])
            ] : null;
        });

        return [
            m('div.ui.card', [
                card.vm.profilePicture.view({
                    editable: editable,
                    userImageURL: basicUserInfo().picture()
                }),
                m('div.content', [
                    m('div.ui.header', basicUserInfo().roles().join(', ')),
                    m('div.ui.divider'),
                    handlesView
                ])
            ])
        ]
    };

    return card;
};

module.exports = ContactCard;
