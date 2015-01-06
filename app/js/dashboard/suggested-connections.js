/**
 * Created by austinstone on 1/6/15.
 */

var User = require('model/user');

var SuggestedConnections = function (Users) {

  var suggestedConnections = {};

  var vm =
    suggestedConnections.vm = {
      init: function () {
        vm.users = m.prop(Users)
      }
    };


  suggestedConnections.controller = function () {
    vm.init();
  };

  suggestedConnections.view = function () {
    return [
      m("div.ui.grid",[
        m("div.three.wide.column",[
          m("div.three.wide.column",[
            m("div.three.wide.column",[
              m("div.ui.relaxed.divided.items",[
                m("div.item","This is an item!!")
              ])
            ])
          ])
        ])
      ])
    ];
  };

  return suggestedConnections;
};

module.exports = SuggestedConnections;
