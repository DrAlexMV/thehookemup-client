var Pagination = require('common/ui-core/pagination');
var StreamCommon = require('common/stream-common');

var CommunicationsFeed = function () {
  var communicationsFeed = {};

  var vm = {
    communications: m.prop([]),
    pagination: Pagination(),
    currentPage: m.prop(_.parseInt(m.route.param('page')) || 0),
    resultsPerPage: 2
  };


  CommunicationsFeed.stream = Bacon.mergeAll(vm.pagination.stream);

  StreamCommon.on(CommunicationsFeed.stream, 'PageSelected::Pagination', function (message) {
    vm.currentPage(message.parameters.page);
    m.route('/notifications?page='+message.parameters.page);
  });


  communicationsFeed.view = function (selected, communications) {

    var numItems = communications.length;
    communications = communications.slice(vm.currentPage() * vm.resultsPerPage, vm.currentPage() * vm.resultsPerPage + vm.resultsPerPage);

    var contents = function () {

      return communications.map(function (communication) {
        return [
          m("div.ui.segment", [
            communication.view()
          ])
        ];
      })
    };

    return [
      m('div.ui.stacked.segment', [
        m('h3.ui.centered.header', [
          selected
        ]),
        m('div.ui.divider'),
          communications.length > 0 ? contents() : m('h4.ui.centered.header', 'Nothing to see here!'),
        m("div.ui.padded.grid", [
          m("div.right.aligned.one.column.row", [
            vm.pagination.view(Math.ceil(numItems / vm.resultsPerPage), 0, Math.ceil(numItems / vm.resultsPerPage))
          ])
        ])
      ])
    ];
  };

  return communicationsFeed;
};

module.exports = CommunicationsFeed;