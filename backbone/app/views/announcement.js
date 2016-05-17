'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'announcement-item',
  render: function() {

    var parts = this.model.parts.map(function(part) {
      return part.body;
    });

    this.$el.append('<div class="unread-bullet ' + (this.model.isRead ? '' : 'fa fa-circle') + '"></div>' +
                    '<div class="name">' + (this.model.sender.displayName) + '</div>' +
                    '<div class="announcement-parts closed">' +
                      '<div class="bubble text">' + parts + '</div>' +
                    '</div>' +
                    '<div class="timestamp">' + window.layerSample.dateFormat(this.model.sentAt)+'</div>');
  },
  events: {
    'click': 'clickAnnouncement'
  },
  clickAnnouncement: function(e) {
    this.$el.find('.announcement-parts').toggleClass('closed');

    if (this.model.isRead === false) {
      this.$el.find('.unread-bullet').removeClass('fa fa-circle');
      this.model.isRead = true;
    }
  }
});
