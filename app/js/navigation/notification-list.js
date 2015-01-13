


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

  notificationList.stream = new Bacon.Bus();





 notificationList.vm = {
        users: users
      /*users: [
       jQuery.parseJSON('{"_id":"54a5bed1da6bde8f54b164e9","firstName":"queryTest1","lastName":"quertyTest1 Lastname","dateJoined":"2015-01-01 21:40:32.898000","graduationYear":null,"major":null,"description":null,"university":null,"role":"Programmer","picture":null}'),

       jQuery.parseJSON('{"_id":"54a5f7f9da6bde9ba34c1175","firstName":"name","lastName":"lastname","dateJoined":"2015-01-02 01:44:25.346000","graduationYear":null,"major":null,"description":null,"university":null,"role":"faggot","picture":null}')

       ]*/


};


  //TODO: asyncronously save the requests to database, and have the dashboard update based only on the stream update.
  //I can't for the life of me get this to work.
  function respond(response,userId, userIndex) {
    /*response is yes or no whether the request was accepted*/
    if (response==='Connect')
    {
      notificationList.vm.users.splice(userIndex, 1);
      UserEdges.connectMe(userId).then(
        //console.log("Request Confirmed!!!"),

      Context.setPendingConnections(notificationList.vm.users)
    );
    }
    else
    {
      notificationList.vm.users.splice(userIndex, 1);
      UserEdges.deleteConnection(userId).then(
        //
        Context.setPendingConnections(notificationList.vm.users)
        //console.log("Request deleted!")
       );

    }
    console.log(response);
    console.log('NotificationList::'+response);
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
      list = vm.users.map(function(user,idx) {
        return [
          m("div.item",[
            m("a.item[href=http://127.0.0.1:5000/profile/" + user._id() + "]", {config: m.route},[
            m("div.ui.card",[
               m("div.content",[
               m("div.header", [
                  m('img.ui.avatar.image', { src: User.getPicture(user) }),
                  "Request from " + User.getName(user) + "!"
            ]),
            m("div.description", "Would you like to connect?"),
                 m("div.ui.two.bottom.attached.buttons",[
                   m("div.ui.green.button",{onclick: respond.curry('Connect', user._id(), idx)},"Yes"),
                   m("div.ui.red.button",{onclick: respond.curry('NoConnect', user._id(), idx)},"No")

                 ])
                 ])
            ])
          ])

      ])

       ]
      });
    }


    return([
      m("i.alarm.outline.icon"),
      m("div.menu",[
        list
      ])
    ])
  };

  return notificationList;
};

module.exports = NotificationList;