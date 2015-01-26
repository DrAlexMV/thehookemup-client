var CommunicationsMenu = require('communications/communications-menu');
var CommunicationsFeed = require('communications/communications-feed');
var Context = require('common/context');
var StreamCommon = require('common/stream-common');
var ConnectionRequest = require('communications/connection-request');
var UserEdges = require('model/user-edges');
var ConversationPreview = require('communications/conversation-preview');
var ConversationDisplay = require('communications/conversation-display');
var MessageDisplay = require('communications/message-display');



//TODO: In general this file is kinda messy. Since a huge part of its functionality is dependent on exactly how we implement messaging,
//TODO: I'm going to wait until then to clean it up.
var communications = {};

communications.stream = Bacon.mergeAll(Context.stream);

var vm =
  communications.vm = {
    init: function () {
      var vm = this;
      vm.conversationPreviews = m.prop([]);
      vm.conversationDisplay = m.prop(ConversationDisplay());
      vm.menu = CommunicationsMenu();
      vm.feed = CommunicationsFeed();
      vm.connectionRequests = m.prop([]);

      //messages should probably be like edges, with an array of sent incoming objects with a field of users and messages
      vm.messages = m.prop([])//"Hey what is up How u been?", "I know that such a planet can be interesting because there is probably water and life could evolve. But to me it seems a bit worthless to make a hype about finding new earth-like planets.", "know that such a planet can be interesting because there is probably water and life could evolve. But to me it seems a bit worthless to make a hype about finding new earth-like planets."]);
      vm.selected = m.prop('Requests');
      vm.currentUserEdges = m.prop([]);

      function listenToStreams() {

        StreamCommon.on(communications.stream,
          'CommunicationsMenu::Tab', function (message) {
            vm.selected(message.parameters.tab);
          }
        );

        //TODO: refactor this complex logic (which also happens into notifications list) into a method somewhere
        StreamCommon.on(communications.stream,
          'ConnectionRequest::Connect',
          function (message) {
            //find the entry in the list that made the response
            var idx = _.findIndex(communications.vm.connectionRequests(), function (crm) {
              return crm.userId === message.parameters.userId;
            });
            //remove the entry from the list
            communications.vm.connectionRequests().splice(idx, idx + 1);


            //the items index in communications.vm.connectionRequests could be in a different order from
            //the index in currentUserEdges, since we keep connectionRequests sorted by date. Theoretically
            //they should be in the same order, but just wanted to play it safe.
            var userToAdd = _.find(vm.currentUserEdges().pendingConnections(), function (user) {
                return (user._id() === message.parameters.userId)
              }
            );

            //rewrite idx to be the idx in pendingConnections
            idx = _.findIndex(vm.currentUserEdges().pendingConnections(), function (pc) {
                return (pc._id() === message.parameters.userId)
              }
            );

            //Update the context now that the connection is accepted
            UserEdges.connectMe(message.parameters.userId).then(
              function (response) {

                var es = vm.currentUserEdges();
                var cs = es.connections();

                cs.push(userToAdd);
                es.connections(cs);

                var pc = es.pendingConnections();

                pc.splice(idx, 1);
                es.pendingConnections(pc);

                Context.setCurrentUserEdges(es);
              }
            );
          }
        );

        StreamCommon.on(communications.stream,
          'ConnectionRequest::NoConnect',
          function (message) {
            //find the entry in the list that made the response
            var idx = _.findIndex(communications.vm.connectionRequests(), function (crm) {
              return crm.userId === message.parameters.userId;
            });

            communications.vm.connectionRequests().splice(idx, idx + 1);


            //rewrite idx to be the idx in pendingConnections, same reasoning as above
            idx = _.findIndex(vm.currentUserEdges().pendingConnections(), function (pc) {
                return (pc._id() === message.parameters.userId)
              }
            );

            //Update the context now that the connection is accepted
            UserEdges.deleteConnection(message.parameters.userId).then(
              function () {
                var es = vm.currentUserEdges();
                var pc = es.pendingConnections();

                pc.splice(idx, 1);
                es.pendingConnections(pc);

                Context.setCurrentUserEdges(es);
              }
            )
          }
        );
      }


      Context.getCurrentUserEdges().then(
        function (edgesProp) {
          if (edgesProp != null && edgesProp != undefined) {
            vm.currentUserEdges = edgesProp;
            vm.connectionRequests(
              vm.currentUserEdges().pendingConnections().map(function (user) {
                message = vm.currentUserEdges().pendingConnectionsMessages()[user._id()];
                return ConnectionRequest(user, message);
              }));

            /*vm.conversationDisplays(
             vm.messages().map(function(message){
             return vm.conversationDisplaymessage
             }));*/

            //get all the streams from the connection requests
            var streamArray = (_.range(0, communications.vm.connectionRequests().length, 1).map(
              function (idx) {
                return communications.vm.connectionRequests()[idx].stream
              })
              );

            //add stream from menu (tab selection)
            streamArray.push(vm.menu.stream);

            communications.stream = Bacon.mergeAll(
              streamArray
            );
            listenToStreams();
          }
        }, Error.handle);


    }
  };


communications.controller = function () {

  console.log("in the controller of comm");
  communications.vm.init();

};

communications.view = function () {

  //TODO: replace ifs with m.prop()

  if (vm.selected() === 'Requests') {
    return [
      m('div.ui.stackable.page.grid', [
        m('div.four.wide.column', [
          vm.menu.view()
        ]),
        m('div.twelve.wide.column', [
          vm.feed.view(vm.selected(), vm.connectionRequests())
        ])
      ])
    ];
  }
  if (vm.selected() === 'Messages') {
    //TODO: this will be put in the vm when we have actual data
    vm.conversationPreviews(vm.messages().map(function (message) {

      return ConversationPreview();//message, vm.currentUserEdges().pendingConnections()[0])
    }));

    var messagesSideScroll = vm.feed.view(vm.selected(), vm.conversationPreviews());

    return [
      m('div.ui.stackable.page.grid', [
        m('div.row', [
          m('div.seven.wide.column', [
            vm.menu.view()
          ])
        ]),
        m('div.seven.wide.column', [
          messagesSideScroll
        ]),
        m('div.nine.wide.column', [
          //TODO: put this in vm init when we have data
          vm.conversationDisplay().view()/*MessageDisplay("Some message!!!!", vm.currentUserEdges().pendingConnections()[0]),
              MessageDisplay("Some response word word word word word nable a background sending mode that is optimized for bulk sending. In async mode, messages/send will immediately return a status of for every recipient. To handle rejections when sending in async mode, set up a webhook for the 'reject' event. Defaults to false for messages with no more than 10 recipients; messages with more than 10 recipients are always sent asynchronously, regardless of the value of async.!!!!", vm.currentUserEdges().pendingConnections()[0]),
              MessageDisplay("Some message!!!!", vm.currentUserEdges().pendingConnections()[0])]*/
        ])
      ])
    ];
  }
};

module.exports = communications;