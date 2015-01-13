


var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var UtilsGeneral = require('common/utils-general');
var User = require('model/user');
var API = require('common/api');
var UserEdges = require('model/user-edges');
var Context = require('common/context');


/*
  Notification can be a request to connect
 */

var NotificationList = function (users) {
  var notificationList = {};

  //currently unused
  notificationList.stream = new Bacon.Bus();


  notificationList.vm = {
    users: users
};


  function respond(response,userId, userIndex) {
    /*response is yes or no whether the request was accepted*/
    if (response==='Connect')
    {
      var user = notificationList.vm.users[userIndex];
      notificationList.vm.users.splice(userIndex, 1);

      UserEdges.connectMe(userId).then(
        Context.setPendingConnections(notificationList.vm.users),
        Context.getEdges().then(function(response) {
          //append the new user to the connections array field of the edges in context
          response().connections((response().connections()).concat([user]));
          Context.setEdges(response());
        })
      );
    }
    else
    {
      notificationList.vm.users.splice(userIndex, 1);
      UserEdges.deleteConnection(userId).then(
        Context.setPendingConnections(notificationList.vm.users)
       );
    }
    //currently unused
    notificationList.stream.push(new StreamCommon.Message('NotificationList::'+response, {
      _id:userId
    }));
  }

  notificationList.controller = function() {

  };



  notificationList.view = function () {
    var vm = notificationList.vm;
    var list = [];
    if (vm.users) {
      list = vm.users.map(function (user, idx) {
        return [
          m("div.item", [
            m("div.ui.card", [
              m("div.content", [
                m("div.header", [
                  m('img.ui.avatar.image', { src: User.getPicture(user) }),
                    m("a", {href: "http://localhost:3000/?/profile/" + user._id() }, {config: m.route}, [
                     "Request from " + User.getName(user) + "!"
                    ]),
                  m("p",[
                    m("div.description", "Would you like to connect?")
                  ]),
                  m("div.ui.two.bottom.attached.buttons", [
                    m("div.ui.green.button", {onclick: respond.curry('Connect', user._id(), idx)}, "Yes"),
                    m("div.ui.red.button", {onclick: respond.curry('NoConnect', user._id(), idx)}, "No")
                  ])
                ])
              ])
            ])
          ])
        ]
      });
    }
    if (users.length == 0) {
      return([
        m("i.alarm.outline.icon"),
        m("div.menu", [
          list
        ])
      ])
    }
    else {
      return([
        m("i.alarm.icon"),users.length,
        m("div.menu", [
          list
        ])
      ])
    }
  };

  return notificationList;
};

module.exports = NotificationList;