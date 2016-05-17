'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.message-composer',
  initialize: function() {
    this.$el.hide();
  },
  render() {
    this.$el.show();
    this.$el.find('input').focus();
  },
  newConversation: function() {
    this.$el.show();
    this.conversation = null;
  },
  events: {
    'keypress input': 'inputAction'
  },
  inputAction: function(e) {
    var text = e.target.value.trim();
    if (!this.conversation) {
      if (e.keyCode === 13 && text) {
        this.trigger('conversation:create', text);
        e.target.value = '';
      }
      return;
    }

    this.trigger('typing:started');

    if (e.keyCode !== 13 || !text) return true;
    console.log('send: ' + text);

    // Example of using custom mime type
    if (text.indexOf('> ') === 0) {
      this.conversation.createMessage({
        parts: [{
          mimeType: 'text/quote',
          body: text.substring(2)
        }]
      }).send();
    } else { // Text plain is default
      this.conversation.createMessage(text).send();
    }

    e.target.value = '';
    this.trigger('typing:finished');
  }
});
