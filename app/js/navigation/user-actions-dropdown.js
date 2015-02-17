/**
 * Created by austinstone on 2/13/15.
 */

var API = require('common/api');
var User = require('model/user');


/*
 Notification can be a request to connect
 */

//TODO: Add logout capability once an endpoint for that becomes available..

var UserActions = function (user) { // edges is an m.prop
    var userActions = {};

    function truncate(string, n) {
        return string.length > n ? string.substr(0, n - 1) + '...' : string;
    }


    var listObject = [
        m('div.ui.card', [
            m('div.content', [
                m('div.ui.grid', [
                    m('div.eight.wide.center.aligned.column', [
                        m('div.ui.vertical.buttons', [
                            m('div.ui.small.button', {onclick: m.route.bind(this, '/profile/me')}, "Profile"),
                            m('div.ui.small.button', {onclick: m.route.bind(this, '/startup-wizard')}, "Create a Startup"),
                            m('div.ui.small.button', {onclick: m.route.bind(this, '/logout')}, "Logout")
                        ])
                    ]),

                    m('div.eight.wide.center.aligned.column', [
                        m('div.description', truncate(user.getName(), 20)),
                        m('br'),
                        m("img.ui.centered.tiny.rounded.image[style='height:60px;width:60px']", { src: user.getPicture() }),
                        m('br'),
                        m('div.description', 'Endorsements: ', user.endorsementCount())
                    ])
                ])
            ])
        ])
    ];

    userActions.view = function () {
        return [
            m("img.ui.small.rounded.image[style='height:20px;width:20px']", { src: user.getPicture() }),
            m('div.menu', [
                listObject,
                m('div.ui.right.aligned.item', [
                    m('a', { href: '/', config: m.route }, [
                        'Go to main page'
                    ])
                ])
            ])
        ];
    };
    return userActions;
};

module.exports = UserActions;
