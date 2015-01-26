var Pagination = require('common/ui-core/pagination');
var StreamCommon = require('common/stream-common');


//Used for both displaying conversations preview and for the requests

var CommunicationsFeed = function () {
  var communicationsFeed = {};

  var vm = {
    communications: m.prop([]),
    pagination: Pagination(),
    currentPage: m.prop(_.parseInt(m.route.param('page')) || 0),
    resultsPerPage: 5
  };


  communicationsFeed.stream = Bacon.mergeAll(vm.pagination.stream);

  StreamCommon.on(communicationsFeed.stream, 'PageSelected::Pagination', function (message) {
    vm.currentPage(message.parameters.page);
    m.route('/notifications?page=' + message.parameters.page);
  });


  communicationsFeed.view = function (selected, communications) {
    var messageSearchBar = [];

    //TODO: This probably isn't a good way of doing this
    if (selected === 'Messages') {
      messageSearchBar = [
        m('div.ui.fluid.action.input', [
          m('input[type="text"]', { placeholder: 'Search Messages' }),
          m('div.ui.icon.button', [
            m('i.search.icon')
          ])
        ])
      ]
    }

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
        messageSearchBar,
          communications.length > 0 ? contents() : m('h4.ui.centered.header', 'Nothing to see here!'),
        m("div.ui.padded.grid", [
          m("div.right.aligned.one.column.row", [
            vm.pagination.view(Math.ceil(numItems / vm.resultsPerPage), vm.currentPage(), Math.ceil(numItems / vm.resultsPerPage))
          ])
        ])
      ])
    ];
  };

  return communicationsFeed;
};

module.exports = CommunicationsFeed;