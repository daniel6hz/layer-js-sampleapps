'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'message-item',
  render: function() {

    var timestamp = window.layerSample.dateFormat(this.model.sentAt);
    var parts = '';

    if (!this.model.isDestroyed) {
      this.model.parts.forEach(function(part) {
        switch(part.mimeType) {
          case 'text/plain':
            parts += '<div class="bubble text">' + part.body + '</div>';
            break;
          case 'text/quote':
            parts += '<div class="bubble quote">' + part.body + '</div>';
            break;
        }
      });

      this.$el.append('<div class="avatar-image"><img src="' + this.model.sender.avatarUrl + '" /></div>' +
                      '<div class="message-content">' +
                        '<span class="name">' + this.model.sender.displayName + '</span>' +
                        '<div class="message-parts">' + parts + '</div>' +
                      '</div>' +
                      '<div class="timestamp">' + timestamp +
                        '<span class="message-status">' + this.getMessageStatus() + '</span>' +
                      '</div>');
    }
  },
  getMessageStatus: function() {
    switch (this.model.readStatus) {
      case 'NONE':
        return 'unread';
      case 'SOME':
        return 'read by some';
      case 'ALL':
        return 'read';
      default:
        return 'unread';
    }
  },
  getMessageParts: function(part) {
    var bubbleType = '';

    switch (part.mimeType) {
      case 'text/plain':
        bubbleType = 'text';
        break;
      case 'text/quote':
        bubbleType = 'quote';
        break;
    }

    return '<div class="bubble ' + bubbleType + '">' + part.body + '</div>';
  }
});
