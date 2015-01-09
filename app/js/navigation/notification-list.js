


var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var UtilsGeneral = require('common/utils-general');
var User = require('model/user');
var API = require('common/api');
var UserEdges = require('model/user-edges');


/*
  Notification can be a request to connect
 */

var NotificationList = function (users) {
  var notificationList = {};

  notificationList.stream = new Bacon.Bus();
/*
  function dismiss(whichNotification) {
    .stream.push(new StreamCommon.Message('ConnectWithModal::'+whichButton, {}));
  }
*/
 notificationList.vm = {
        users: users
      /*users: [
       jQuery.parseJSON('{"_id":"54a5bed1da6bde8f54b164e9","firstName":"queryTest1","lastName":"quertyTest1 Lastname","dateJoined":"2015-01-01 21:40:32.898000","graduationYear":null,"major":null,"description":null,"university":null,"role":"Programmer","picture":null}'),

       jQuery.parseJSON('{"_id":"54a5f7f9da6bde9ba34c1175","firstName":"name","lastName":"lastname","dateJoined":"2015-01-02 01:44:25.346000","graduationYear":null,"major":null,"description":null,"university":null,"role":"faggot","picture":null}')

       ]*/





};

  notificationList.controller = function() {

  };



  notificationList.view = function () {
    var vm = notificationList.vm;
    var list = [];
    if (vm.users) {
      list = vm.users.map(function(user) {
        return [
          m("div.item",[
            m("a.item[href=http://127.0.0.1:5000/profile/" + user._id() + "]", {config: m.route},[
            m('div.ui.image', [
              m('img', { src: User.getPicture(user) })
            ]),
            m("div.content", [
              m("div.header", User.getName(user)),
              m("div.content", user.role())
            ])
          ])
        ])
       ]
      });
    }


    return([
      m("i.world.icon"),
      m("div.menu",[
        list
      ])
    ])
  };

  return notificationList;
};

module.exports = NotificationList;