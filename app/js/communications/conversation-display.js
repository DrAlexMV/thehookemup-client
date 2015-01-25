/**
 * Created by austinstone on 1/24/15.
 */

/**
 * Created by austinstone on 1/24/15.
 */


var Pagination = require('common/ui-core/pagination');
var StreamCommon = require('common/stream-common');
var WriteMessage = require('communications/write-message');

var ConversationDisplay = function () {
  var conversationDisplay = {};

  var vm = {
    communications: m.prop([]),
    //pagination: Pagination(),
    currentPage: m.prop(_.parseInt(m.route.param('page')) || 0),
    resultsPerPage: 10
  };


  //conversationDisplay.stream = Bacon.mergeAll(vm.pagination.stream);

  /*StreamCommon.on(conversationDisplay.stream, 'PageSelected::Pagination', function (message) {
   vm.currentPage(message.parameters.page);
   m.route('/notifications?page='+message.parameters.page);
   });*/


  conversationDisplay.view = function (users, messageDisplays) {


    var numItems = messageDisplays.length;
    messageDisplays = messageDisplays.slice(vm.currentPage() * vm.resultsPerPage, vm.currentPage() * vm.resultsPerPage + vm.resultsPerPage);

    var contents = function () {

      return messageDisplays.map(function (messageDisplay) {
        return [
          m("div.ui.segment", [
            messageDisplay.view()
          ])
        ];
      })
    };


    return [
      m('div.ui.stacked.segment', [
        m('h3.ui.centered.header', "Conversation between some user names"),
        m('div.ui.divider'),
          messageDisplays.length > 0 ? [
            contents(),
            m("br"),
            WriteMessage().view(users)
          ] : m('h4.ui.centered.header', 'Nothing to see here!')
      ])
    ];
  };

  return conversationDisplay;
};

module.exports = ConversationDisplay;