/**
 * Created by austinstone on 1/9/15.
 */
var StreamCommon = require('common/stream-common');

var DropdownMixin = function (body) {

  var dropdownMixin = {};

  var vm = dropdownMixin.vm = {
    body: body
  };

  dropdownMixin.stream = Bacon.mergeAll(body.stream);

  StreamCommon.on(dropdownMixin.stream, 'NotificationList::Connect', function(message){
    console.log("received stream from dropdownMixin!")
  });

  function config(element, isInitialized) {
      $(element).dropdown()
  }

  dropdownMixin.view = function () {
    return [
      m('div.ui.top.right.pointing.dropdown.button', {config:config},[
        body.view()
        ])
    ];
  };

  return dropdownMixin;
};

module.exports = DropdownMixin;
