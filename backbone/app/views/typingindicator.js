'use strict';

var Backbone = require('backbone');

module.exports = Backbone.View.extend({
  el: '.typing-indicator-panel',
  render: function() {
    var text = '';
    if (this.typing.length > 0) {
      var names = this.typing.map(function(identity) {
        return identity.displayName;
      });
      var prefix = names.length === 1 ? ' is' : ' are';
      text = names.join(', ') + prefix + ' typing...';
    }
    this.$el.text(text);
  }
});
