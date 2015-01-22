var CommunicationsMenu = require('communications/communications-menu');
var CommunicationsFeed = require('communications/communications-feed');
var Context = require('common/context');
var StreamCommon = require('common/stream-common');
var ConnectionRequestCommunication = require('communications/connection-request-communication');
var UserEdges = require('model/user-edges');


var communications = {};

communications.stream = Bacon.mergeAll(Context.stream);

var vm =
  communications.vm = {
    init: function () {
      var vm = this;

      vm.menu = CommunicationsMenu();
      vm.feed = CommunicationsFeed();
      vm.connectionRequestCommunications = m.prop([]);
      vm.selected = m.prop('Requests');
      vm.currentUserEdges = m.prop([]);

      function listenToStreams() {

        //These only work when placed here or somehow forced to be declared after the callback which gets the
        //currentUserEdges
        StreamCommon.on(communications.stream,
          'ConnectionRequestCommunication::Connect',
          function (message) {
            //find the entry in the list that made the response
            var idx = _.findIndex(communications.vm.connectionRequestCommunications(), function (crm) {
              return crm.vm.userId === message.parameters.userId;
            });
            //remove the entry from the list
            communications.vm.connectionRequestCommunications().splice(idx, idx + 1);


            //the items index in communications.vm.connectionRequestCommunications could be in a different order from
            //the index in currentUserEdges, since we keep connectionRequestCommunications sorted by date. Theoretically
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
          'ConnectionRequestCommunication::NoConnect',
          function (message) {
            //find the entry in the list that made the response
            var idx = _.findIndex(communications.vm.connectionRequestCommunications(), function (crm) {
              return crm.vm.userId === message.parameters.userId;
            });

            communications.vm.connectionRequestCommunications().splice(idx, idx + 1);


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
            vm.connectionRequestCommunications(
              vm.currentUserEdges().pendingConnections().map(function (user) {
                message = vm.currentUserEdges().pendingConnectionsMessages()[user._id()];
                return ConnectionRequestCommunication(user, message);
              }));

            //merge the streams of all entries in the list
            communications.stream = Bacon.mergeAll(
              (_.range(0, communications.vm.connectionRequestCommunications().length, 1).map(
                function (idx) {
                  return communications.vm.connectionRequestCommunications()[idx].stream
                }
              )
                )
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
  return [
    m('div.ui.stackable.page.grid', [
      m('div.three.wide.column', [
        vm.menu.view()
      ]),
      m('div.thirteen.wide.column', [
        vm.feed.view(vm.selected(), vm.connectionRequestCommunications())
      ])
    ])
  ];
};

module.exports = communications;