/**
 * Created by austinstone on 1/26/15.
 */

var API = require('common/api');
var Context = require('common/context');
var EditableImage = require('common/editable-image');
var StreamCommon = require('common/stream-common');
var User = require('model/user');
var UserEdges = require('model/user-edges');


//TODO: Get auto hyphenation of messages to work.

/*
 Notification can be a request to connect
 */

var InvitesDropdown = function (invites) {

  var invitesDropdown = {};



  invites.clipBoard = function()
  {
  console.log("hey");
  holdtext.innerText = copytext.innerText;
  Copied = holdtext.createTextRange();
  Copied.execCommand("Copy");
  };



  invitesDropdown.view = function () {
    var list = [];

    if (invites.length > 0) {
      list = invites.map(function (invite, idx) {
        return [
          m("div.item", [
            m('div.ui.segment', invite.inviteCode),
              m("span#copytext[style=height:150; width:162]","Copy to clipboard"),
              m("textarea#holdtext[style=display:none]"),
              m("button",{onclick: invites.clipBoard})
            ])
          ]
      });


      return [
        m("div.menu", [
          list
        ])

      ]
    }


  };
  return invitesDropdown;
};
  module.exports = InvitesDropdown;
