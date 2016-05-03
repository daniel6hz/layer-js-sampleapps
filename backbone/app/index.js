/* global layer */
'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var controller = require('./controller');

/**
 * Wait for identity dialog message to complete
 */
window.addEventListener('message', function(evt) {
  if (evt.data !== 'layer:identity') return;

  /**
   * Initialize Layer Client with `appId`.
   */
  var client = new layer.Client({
    appId: window.layerSample.appId
  });

  /**
   * Client authentication challenge.
   * Sign in to Layer sample identity provider service.
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Client
   */
  client.once('challenge', function(e) {
    window.layerSample.challenge(e.nonce, e.callback);
  });

  /**
   * Start authentication
   */
  client.connect(window.layerSample.userId);

  /**
   * Client ready. Initialize controller.
   */
  client.once('ready', function() {
    controller(client);
  });

  // Set conversations title
  $('.left-panel .panel-header .title').text(window.layerSample.user + '\'s Conversations');
}, false);
