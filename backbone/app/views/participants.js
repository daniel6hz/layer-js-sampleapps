'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.user-list',
  showing: false,
  users: [],
  newConversation: function() {
    this.showing = true;
    this.$el.show();
    this.render();
  },
  hide: function() {
    this.showing = false;
    this.$el.hide();
  },
  render: function() {
    if (!this.showing) return;
    this.$el.empty();
     this.users.forEach(function(user) {
      this.$el.append(
        '<label for="' + user.userId + '" class="participant">' +
          '<div class="avatar-image">' +
            '<img src="' + user.avatarUrl + '" />' +
          '</div>' +
          '<div class="info">' +
            '<div class="main">' +
              '<span class="title">' + user.displayName + '</span>' +
              '<input id="' + user.user.id + '" type="checkbox" name="userList"/>' +
            '</div>' +
          '</div>' +
        '</label>');
    }, this);
  },
  events: {
    'change input': 'participantSelected'
  },
  participantSelected: function() {
    var participants = [];
    this.$el.find('input:checked').each(function(i, input) {
      participants.push(input.id);
    });
    this.trigger('conversation:participants', participants);
  }
});
