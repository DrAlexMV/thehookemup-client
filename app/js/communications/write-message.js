/**
 * Created by austinstone on 1/24/15.
 */

var StreamCommon = require('common/stream-common');

var WriteMessage = function () {
  var writeMessage = {};


  /*
   StreamCommon.on(communicationsFeed.stream, 'PageSelected::Pagination', function (message) {
   vm.currentPage(message.parameters.page);
   m.route('/notifications?page='+message.parameters.page);
   });
   */

  writeMessage.view = function (users) {
    var messageSearchBar = [];
    return[
      m("div.ui.grid"),
      m("div.ui.segment", [


        m("div.ui.form", [
          m("div.field", [
            m("br"),
            m("textarea[placeholder=Please enter a message to " + "user Name" + "]" /*{onchange: m.withAttr('value', vm.message)}*/)
          ])
        ]),
        m("div.right.aligned.one.column.row", [
          m("div.ui.positive.right.labeled.icon.button", "Send", [
            m("i.checkmark.icon")
          ])
        ])
      ])
    ]
  };


  return writeMessage;
};

module.exports = WriteMessage;