/* global layer */
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  /**
   * Hardcoded user identities
   */
  var USERS = [
    {id: 'alice123@layertester.com', 'displayName': 'Alice'},
    {id: 'BobSnob@layertester.com', 'displayName': 'Bob'},
    {id: 'hal9000@layertester.com', 'displayName': 'Robot'}
  ];

  /**
   * layerSample global utility
   *
   * @param {String}    appId - Layer Staging Application ID
   * @param {Array}     users - Hard-coded users Array
   * @param {String}    user - Logged in user
   * @param {Function}  challenge - Layer Client challenge function
   */
  window.layerSample = {
    appId: null,
    users: USERS,
    user: USERS[0],
    followAll: function(client) {
      USERS.forEach(function(user) {
        client.followIdentity(user.id);
      });
    },
    findUser: function(userId) {
      return USERS.filter(function(user) {
        return user.id === userId;
      })[0];
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
            id: window.layerSample.user.id,
            displayName: window.layerSample.user.displayName
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

  div.innerHTML += '<input name="appid" type="text" placeholder="Staging Application ID" value="' + (localStorage.layerAppId || '') + '" />';

  div.innerHTML += '<p>2. Select a user to login as:</p>';

  for (var i = 0; i < USERS.length; i++) {
    var checked = i === 0 ? 'checked' : '';
    div.innerHTML += '<label><input type="radio" name="user" value="' + USERS[i].id + '" ' + checked + '/>' + USERS[i].displayName + '</label>';
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

    button.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';

    window.layerSample.appId = appId;
    try {
       localStorage.layerAppId = appId;
    } catch(e) {}

    var radios = div.getElementsByTagName('input');
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].type === 'radio' && radios[i].checked) {
        var value = radios[i].value;
        window.layerSample.user = USERS.filter(function(user) {
          return user.id === value;
        })[0];
        break;
      }
    }

    window.postMessage('layer:identity', '*');
  });
});
