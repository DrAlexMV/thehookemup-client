/**
 * Created by austinstone on 1/6/15.
 */

var User = require('model/user');
var SuggestedConnections = require('dashboard/suggested-connections');

var dashboard = {};

dashboard.vm = {
  init: function () {
    this.suggestedConnections = m.prop(SuggestedConnections({}));
  }
};


dashboard.controller = function () {
  dashboard.vm.init();
};

dashboard.view = function () {
  return [
    m("div.ui.relaxed.divided.items",[
    m("div.item","This is an item!!")
    ])
  ]
};


module.exports = dashboard;
