'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'message-item',
  render: function() {
    var name = this.model.sender.userId || 'Unknown';
    var initial = name.substr(0, 2).toUpperCase();

    var timestamp = window.layerSample.dateFormat(this.model.sentAt);
    var parts = '';

    if (!this.model.isDestroyed) {
<<<<<<< HEAD
      parts = this.model.parts.map(this.getMessageParts).join('');
=======
      this.model.parts.forEach(function(part) {
        var bubbleType = part.mimeType === 'text/quote' ? 'quote' : 'text';
        parts += '<div class="bubble ' + bubbleType + '">' + part.body + '</div>';
      });
>>>>>>> Mimetype quote updated

      this.$el.append('<div class="avatar">' + initial + '</div>' +
                      '<div class="message-content">' +
                        '<span class="name">' + name + '</span>' +
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
