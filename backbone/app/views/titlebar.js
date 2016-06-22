'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.conversation-header',
  initialize: function() {
    this.emptyState = true;
  },
  newConversation: function() {
    this.conversation = null;
    this.render();
  },
  render: function() {
    console.log('render: Titlebar');
    var html = '';

    if (this.emptyState) {
      html = '<div class="edit-title new-title">&larr; Create a new conversation or select a conversation from the list.</div>';
      this.emptyState = false;
    }
    else if (this.editTitle) {
      html = '<div class="edit-title">' +
                '<input type="text" placeholder="Conversation title..." value="' + (this.conversation.metadata.title || '') + '">' +
                '<button class="cancel">Cancel</button>' +
              '</div>';
    }
    else if (this.conversation) {
      var title = this.conversation.metadata.title;
      if (!title) {
        title = this.conversation.participants.map(function(user) {
          return user.displayName;
        }, this)
        .join(', ').replace(/(.*),(.*?)/, '$1 and$2');
      }
      html = '<div class="title-inner">' + title +
                '<a href="#" class="edit-title-icon" title="Edit conversation title"><i class="fa fa-pencil"></i></a>' +
              '</div>';
    }
    else {
      html = '<div class="edit-title new-title">' +
                '<input type="text" placeholder="Conversation title...">' +
              '</div>';
    }

    this.$el.html('<div class="title">' + html + '</div>');
  },
  events: {
    'keyup input': 'titleChange',
    'click .edit-title-icon': 'titleEdit',
    'click .cancel': 'titleCancel'
  },
  titleChange: function(e) {
    if (this.editTitle && e.keyCode === 13) {
      this.conversation.setMetadataProperties({title: e.target.value});
      this.titleCancel();
    }
    else this.trigger('conversation:title', e.target.value);
  },
  titleEdit: function(e) {
    e.preventDefault();
    this.editTitle = true;
    this.render();
  },
  titleCancel: function() {
    this.editTitle = false;
    this.render();
  }
});
