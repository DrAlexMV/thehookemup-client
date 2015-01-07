/**
 * Created by austinstone on 1/6/15.
 */

var User = require('model/user');
var SuggestedConnections = require('dashboard/suggested-connections');
var UserListBig = require('search/user-list-big');

var dashboard = {};

dashboard.vm = {
  init: function () {
    this.suggestedConnections = SuggestedConnections();
  }
};


dashboard.controller = function () {
  dashboard.vm.init();
};

dashboard.view = function () {
  var vm = dashboard.vm;
  return [
    m("div.ui.three.column.grid",[
        m("div.center.aligned.column",[
          m("div.ui.segment",[
            vm.suggestedConnections.view()
            ])
          ]),
          m("div.center.aligned.column",[
            m("div.ui.segment",[

            ])

          ]),
          m("div.center.aligned.column",[
            m("div.ui.segment",[

          ])
        ])
      ])
  ]
};


module.exports = dashboard;
