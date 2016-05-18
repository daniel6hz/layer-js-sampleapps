/* global layer */
'use strict';

document.addEventListener('DOMContentLoaded', function() {

  /**
   * layerSample global utility
   *
   * @param {String}    appId - Layer Staging Application ID
   * @param {String}    userId - User ID to log in as
   * @param {Function}  challenge - Layer Client challenge function
   * @param {Function}  dateFormat - Get a nice date string
   */
  window.layerSample = {
    appId: null,
    userId: null,
    validateSetup: function(client) {
      var missing = false;
      for (var i = 0; i <= 5; i++) {
        if (!client.getIdentity(String(i))) missing = true;
      }
      if (missing) {
        alert('Your app does not appear to have the expected users setup; see the README.md file which contains instructions for setting up these users');
      }
    },
    challenge: function(nonce, callback) {
      layer.xhr({
        url: 'https://layer-identity-provider.herokuapp.com/identity_tokens',
        headers: {
          'X_LAYER_APP_ID': window.layerSample.appId,
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'POST',
        data: {
          nonce: nonce,
          app_id: window.layerSample.appId,
          user: {
            id: window.layerSample.userId
          }
        }
      }, function(res) {
        if (res.success) {
          console.log('challenge: ok');

          callback(res.data.identity_token);

          // Cleanup identity dialog
          var node = document.getElementById('identity');
          node.parentNode.removeChild(node);
        } else {
          console.error('challenge error: ', res.data);
        }
      });
    },
    dateFormat: function(date) {
      var now = new Date();
      if (!date) return now.toLocaleDateString();

      if (date.toLocaleDateString() === now.toLocaleDateString()) return date.toLocaleTimeString();
      else return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
  };

  /**
   * Dirty HTML dialog injection
   */
  var div = document.createElement('div');
  div.innerHTML += '<img src="http://static.layer.com/logo-only-blue.png" />';
  div.innerHTML += '<h1>Welcome to Layer sample app!</h1>';
  div.innerHTML += '<p>1. Enter your Staging Application ID:</p>';

  div.innerHTML += '<input name="appid" type="text" placeholder="Staging Application ID" value="' +
    (localStorage.layerAppId || '') + '" />';

  div.innerHTML += '<p>2. Select a user to login as:</p>';

  for (var i = 0; i <= 5; i++) {
    var checked = i === 0 ? 'checked' : '';
    div.innerHTML += '<label><input type="radio" name="user" value="' + i + '" ' + checked + '/>' +
      'User ' + i + '</label>';
  }

  var button = document.createElement('button');
  button.appendChild(document.createTextNode('Login'));

  div.appendChild(button);

  var container = document.createElement('div');
  container.setAttribute('id', 'identity');
  container.appendChild(div);
  document.body.insertBefore(container, document.querySelectorAll('.main-app')[0]);

  button.addEventListener('click', function() {
    var appId = div.children.appid.value;
    if (!appId) return alert('Please enter your Staging Application ID');

    window.layerSample.appId = appId;
    try {
       localStorage.layerAppId = appId;
    } catch(e) {}

    var radios = div.getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].type === 'radio' && radios[i].checked) {
        button.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
        window.layerSample.userId = radios[i].value;
        break;
      }
    }

    window.postMessage('layer:identity', '*');
  });
});
