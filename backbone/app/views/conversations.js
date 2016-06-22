'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.conversation-list',
  newConversation: function() {
    this.$el.find('.participant').removeClass('selected-conversation');
  },
  render: function() {
    if (!this.conversations) return;
    console.log('render: ' + this.conversations.length + ' Conversations');

    this.$el.empty();
    this.conversations.forEach(function(conversation) {
      var uuid = conversation.id.substr(conversation.id.lastIndexOf('/') + 1); // extract just UUID
      var unread = conversation.unreadCount !== 0 ? 'unread-messages ' : '';
      var participants = conversation.participants;
      var client = conversation.getClient();

      var title = conversation.metadata.title || participants.map(function(user) {
        return user.displayName;
      });

      var selectedClass = '';
      if (this.conversation && conversation.id === this.conversation.id) selectedClass = 'selected-conversation';

      var avatars = participants.map(function(user) {
        return '<span><img src="' + user.avatarUrl + '" /></span>';
      });
      var cluster = avatars.length > 1 ? 'cluster' : '';

      this.$el.append('<a class="participant ' + unread + selectedClass + '" href="#conversations/' + uuid + '">' +
                        '<div class="avatar-image ' + cluster + '">' + avatars.join('') + '</div>' +
                        '<div class="info">' +
                          '<div class="main">' +
                            '<span class="title">' + title + '</span>' +
                            '<span class="delete fa fa-times-circle" title="Delete conversation" data-id="' + conversation.id + '"></span>' +
                          '</div>' +
                        '</div>' +
                      '</a>');
    }, this);
  },
  events: {
    'click .delete': 'deleteConversation'
  },
  deleteConversation: function(e) {
    e.preventDefault();
    this.trigger('conversation:delete', Backbone.$(e.target).data('id'));
  }
});
