/* global layer */
'use strict';

document.addEventListener('DOMContentLoaded', function() {
  var USERS = null;

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
    users: [],
    user: {},
    followAllUsers: function(client) {
      USERS.forEach(function(user) {
        client.followIdentity(user.id);
      });
    },
    rememberUser(user) {
      var matches = USERS.filter(function(item) {
        return item.userId === user.userId;
      });
      if (!matches.length) {
        USERS.push(user);
        localStorage.SAMPLE_USERS = JSON.stringify(USERS);
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
            id: window.layerSample.user.userId,
            display_name: window.layerSample.user.displayName
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

  try {
    USERS = JSON.parse(localStorage.SAMPLE_USERS);
  } catch(e) {}

  if (!USERS) {
    USERS = [
      {id: 'layer:///identities/netsnark', userId: 'nedsnark', displayName: 'Ned Snark'},
      {id: 'layer:///identities/catelynsnark', userId: 'catelynsnark', displayName: 'Catelyn Snark'}
    ];
  }

  for (var i = 0; i < USERS.length; i++) {
    var checked = i === 0 ? 'checked' : '';
    div.innerHTML += '<label><input type="radio" name="user" value="' + USERS[i].id + '" ' + checked + '/>' + USERS[i].displayName + '</label>';
  }
  div.innerHTML +=
    '<label><input type="radio" name="user" value=""/>' +
    '<input placeholder="Enter new name here" type="text" ' +
    'id="newusername" /></label>';

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
        var value = radios[i].value;
        var selectedUser = USERS.filter(function(user) {
          return user.id === value;
        })[0];
        if (!selectedUser) {
          var newUserName = document.getElementById('newusername').value;
          if (!newUserName) return;
          selectedUser = {
            displayName: newUserName,
            userId: newUserName.replace(/[^a-zA-Z]/g, ''),
            id: 'layer:///identities/' + encodeURIComponent(newUserName.replace(/[^a-zA-Z]/g, ''))
          };
          window.layerSample.rememberUser(selectedUser);
        }

        button.innerHTML = '<i class="fa fa-spinner fa-pulse"></i>';
        window.layerSample.user = selectedUser;

        break;
      }
    }

    window.postMessage('layer:identity', '*');
  });
});
