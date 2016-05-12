/* global angular */
'use strict';

var controllers = angular.module('newConversationPanelControllers', []);

/**
 * The New Conversation Controller provides a UI for creating a new Conversation.
 * This consists of a place to edit a title bar, a list of users to select,
 * and a place to enter a first message.
 */
controllers.controller('newConversationCtrl', function($scope, $rootScope) {
  var addusername = document.getElementById('addusername');
  // Once we are authenticated load the User list
  $scope.$watch('appCtrlState.isReady', function(newValue) {
    if (newValue) {
      $scope.users = [];

      // Create the User List query
      $scope.query = $scope.appCtrlState.client.createQuery({
        model: layer.Query.Identity,
        dataType: 'object',
        paginationWindow: 500
      });

      $scope.query.on('change', function() {
        $scope.users = $scope.query.data.filter(function(user) {
          return user.id !== $scope.appCtrlState.client.user.id;
        });
        $scope.users.forEach(function(user) {
          // displayName is null for any user who has never logged in
          // and never had the Platform API setup an Identity.
          if (user.displayName === null) user.displayName = user.userId;
        });
        $rootScope.$digest();
      });
    }
  });

  /**
   * Hacky DOMish way of getting the selected users
   * Angular developers should feel free to improve on this
   * and submit a PR :-)
   */
  function getSelectedUsers() {
    var result = Array.prototype.slice.call(document.querySelectorAll('.user-list :checked'))
      .map(function(node) {
        return $scope.appCtrlState.client.getIdentity(node.value);
      });

    if (addusername.value) {
      result.push(createUser());
    }

    result.push($scope.appCtrlState.client.user);
    return result;
  }

  /**
   * On typing a message and hitting ENTER, the send method is called.
   * $scope.chatCtrlState.currentConversation is a basic object; we use it to get the
   * Conversation instance and use the instance to interact with Layer Services
   * sending the Message.
   *
   * See: http://static.layer.com/sdk/docs/#!/api/layer.Conversation
   *
   * For this method, we simply do nothing if no participants;
   * ideally, some helpful error would be reported to the user...
   *
   * Once the Conversatino itself has been created, update the URL
   * to point to that Conversation.
   */
  $scope.send = function() {
    var participants = getSelectedUsers().map(function(user) {
      return user.userId;
    });
    if (participants.length) {

      var metadata = {};
      if ($scope.newTitle) metadata.title = $scope.newTitle;

      // Create the Conversation
      var conversationInstance = $scope.appCtrlState.client.createConversation({
        participants: participants,
        distinct: participants.length === 2,
        metadata: metadata
      });

      // Update our location.
      location.hash = '#' + conversationInstance.id.substring(8);
      conversationInstance.once('conversations:sent', function() {
        // A Conversation ID may change after its sent
        // if the server returns a matching Distinct Conversation.
        if (location.hash !== '#' + conversationInstance.id.substring(8)) {
          location.hash = '#' + conversationInstance.id.substring(8);
          $scope.$digest();
        }
      });


      // Create and send the Message.  Note that sending the Message
      // will also insure that the Conversation gets created if needed.
      conversationInstance.createMessage($scope.sendText).send();

      // Reset state
      $scope.sendText = '';
      Array.prototype.slice.call(document.querySelectorAll('.user-list :checked')).forEach(function(input) {
        input.checked = false;
      });

      if (addusername.value) {
        window.layerSample.rememberUser(createUser());
      }

      addusername.value = '';
    }
  };

  function createUser() {
    return {
      displayName: addusername.value,
      userId: addusername.value.replace(/[^a-zA-Z]/g, ''),
      id: 'layer:///identities/' + encodeURIComponent(addusername.value.replace(/[^a-zA-Z]/g, ''))
    };
  }

  /**
   * Get initials from user
   *
   * @method
   * @param  {Object} message - Message object or instance
   * @return {string} - User's display name
   */
  $scope.getSenderInitials = function(user) {
    if (user === null) {
      if (!addusername.value) return;
      user = createUser();
    }
    var parts = user.displayName.split(' ');
    if (parts.length > 1) {
      return (parts[0].substr(0, 1) + parts[1].substr(0, 1)).toUpperCase();
    } else {
      return user.displayName.substr(0, 2).toUpperCase();
    }
  };

  /**
   * Any time the checkbox list of users changes, udpate the
   * title to match.  Don't update the title if the user
   * has changed the title manually.
   */
  $scope.updateTitle = function() {
    if (!$scope.userChangedTitle) {
      $scope.newTitle = getSelectedUsers().map(function(user) {
        return user.displayName;
      }).join(', ').replace(/(.*),(.*?)/, '$1 and$2')
    }
  };
});

/**
 * The User List Controller manages a list of users with checkboxes next to them
 * for setting up participants for a new conversation.
 */
controllers.controller('userListCtrl', function($scope) {


});
