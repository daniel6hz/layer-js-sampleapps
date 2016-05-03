'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var AnnouncementView = require('./announcement');

module.exports = Backbone.View.extend({
  el: '.announcements-dialog',
  render: function() {
    if (!this.announcements) return;
    console.log('render: ' + this.announcements.length + ' Announcements');

    this.$list = this.$el.find('.announcement-list');
    this.$list.empty();

    this.announcements.forEach(this.addAnnouncement, this);
  },
  addAnnouncement: function(announcement) {
    var announcementView = new AnnouncementView({model: announcement});
    this.$list.append(announcementView.$el);
    announcementView.render();
  },
  events: {
    'click .announcement-list-container': 'clickStopPropagation',
    'click': 'hide'
  },
  clickStopPropagation: function(e) {
    e.stopPropagation();
  },
  show: function() {
    this.$el.removeClass('hidden');
  },
  hide: function() {
    this.$el.addClass('hidden');
    Backbone.history.navigate('/', {trigger: true});
  }
});
