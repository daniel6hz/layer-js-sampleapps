/* global angular layer */
'use strict';

var controllers = angular.module('conversationPanelControllers', []);

/**
 * The Conversation Controller manages:
 *
 * * An editable titlebar
 * * A scrollable/pagable list of Messages
 * * A SendPanel for composing and sending Messages
 */
controllers.controller('conversationCtrl', function($scope) {
  $scope.editingTitle = false;
  var typingListener = $scope.appCtrlState.client.createTypingListener(
      document.querySelectorAll('.message-textarea')[0]);

  /**
   * On typing a message and hitting ENTER, the send method is called.
   * $scope.chatCtrlState.currentConversation is a basic object; we use it to get the
   * Conversation instance and use the instance to interact with Layer Services
   * for sending the Message.
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Message
   */
  $scope.send = function() {
    var conversationInstance = $scope.appCtrlState.client.getConversation($scope.chatCtrlState.currentConversation.id);
    if (conversationInstance) {
      conversationInstance.createMessage($scope.sendText).send();
      $scope.sendText = '';
    }
  };

  /**
   * Any time the currentConversation has changed, monitor the new conversation
   * for changes to its properties/metadata and rerender whenever these change.
   */
  $scope.$watch('chatCtrlState.currentConversation', function(newValue, oldValue) {
    var oldId = oldValue ? oldValue.id : '';
    var newId = newValue ? newValue.id : '';
    if (oldId !== newId) {
      if (newValue) {
        var conversation = $scope.appCtrlState.client.getConversation(newId);

        // Update what Conversation typing indicators are sent as when our user is typing
        typingListener.setConversation(conversation);


        // Listens for all changes to this Conversation's properties;
        // Primarily for rendering changes to metadata.title
        if (conversation) {
          conversation.on('conversations:change', function() {
            $scope.chatCtrlState.currentConversation = conversation.toObject();
            $scope.$digest();
          }, this);
        }
      }

      // Stop listening to the old Conversation's property changes.
      if (oldValue) {
        var oldConversation = $scope.appCtrlState.client.getConversation(oldValue.id);
        if (oldConversation) oldConversation.off(null, null, this);
      }
    }
  }, true);

  /**
   * User is now editting or done editting the title of the Conversation
   */
  $scope.setEditTitle = function(state) {
    $scope.editingTitle = state;
  };

  /**
   * Saving the title is done by updating the Conversation's metadata.
   * See http://static.layer.com/sdk/docs/#!/api/layer.Conversation-method-setMetadataProperties
   */
  $scope.saveTitle = function() {
    var conversationInstance = $scope.appCtrlState.client.getConversation($scope.chatCtrlState.currentConversation.id);
    if (conversationInstance) {
      conversationInstance.setMetadataProperties({
        title: $scope.chatCtrlState.currentConversation.metadata.title
      });
    }
    $scope.editingTitle = false;
  };
});

/**
 * The Typing Indicator Controller renders if anyone is typing
 */
controllers.controller('typingIndicatorCtrl', function($scope) {
  $scope.typing = [];
  $scope.paused = [];

  // Insure that when we change conversations we don't carry
  // typing state over from last Conversation
  $scope.$watch('chatCtrlState.currentConversation', function() {
    $scope.typing = [];
    $scope.paused = [];
  });

  // Any time the typing indicators change for this conversation
  // update our state and rerender.
  // See http://static.layer.com/sdk/docs/#!/api/layer.Client-event-typing-indicator-change
  $scope.appCtrlState.client.on('typing-indicator-change', function(evt) {
    if (evt.conversationId === $scope.chatCtrlState.currentConversation.id) {
      $scope.typing = evt.typing;
      $scope.paused = evt.paused;
      $scope.$digest();
    }
  });

  // Render a typing indicator message
  $scope.getText = function() {
    var users = $scope.typing;
    if (users && users.length > 0) {
      return users.length === 1 ? users[0] + ' is typing' : users.join(', ') + ' are typing';
    } else {
      return '';
    }
  };
});

/**
 * The Message List Controller renders a list of Messages,
 * and provides pagination
 */
controllers.controller('messageListCtrl', function ($scope) {
  // Store all message data here
  $scope.data = [];

  // Property prevents paging; useful if we are mid-pagination operation.
  $scope.disablePaging = true;

  // Create the Messages Query
  $scope.query = $scope.appCtrlState.client.createQuery({
    model: layer.Query.Message,
    dataType: 'object',
    paginationWindow: 30
  });

  /**
   * Whenever new messages arrive:
   *
   * * Flag them as read which will tell the server that they are read
   * * Append the results to our data
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Query for
   * more information on query change events.
   */
  $scope.query.on('change', function(evt) {
    // Ignore reset events unless we already have data
    if (evt.type !== 'reset' || $scope.data.length) {

      // For any change type, get a copy of the query's data
      // and reverse its order
      var data = $scope.query.data.concat([]);
      $scope.data = data.reverse();

      // For every message in the data results, get the message
      // instance and set isRead to true (side-effects notify server its read)
      // Wait 2 seconds before doing this and verify that its still being rendered
      // before proceding.
      setTimeout(function() {
          data.map(function(item) {
            return $scope.appCtrlState.client.getMessage(item.id);
          }).forEach(function(m) {
            if ($scope.query.data.filter(function(item) {
                return item.id === m.id;
            }).length) {
                m.isRead = true;
            }
          });
      }, 2000);

      // After a short delay, reenable paging
      window.setTimeout(function() {
        if (!$scope.query.isFiring) {
          $scope.disablePaging = false;
        }
      }, 500);

      // Any time the query's data changes, rerender.
      if ($scope.$$phase !== '$digest') $scope.$digest();
    }
  });

  // Any time currentConversation points to a new Conversation,
  // Update our query to get that new Conversation's messages.
  // This will trigger a `change` event of type `reset` event followed by a request to the server
  // and then a `change` event of type `data`.
  $scope.$watch('chatCtrlState.currentConversation', function(newValue) {
    $scope.query.update({
      predicate: newValue ? "conversation.id = '" + newValue.id + "'" : null
    });
    $scope.disablePaging = $scope.query.isFiring;
  });

  /**
   * nextPage() is called by the infinite scroller each
   * time it wants another page of messages from the server
   * to render.
   */
  $scope.nextPage = function() {
    if (!$scope.query.isFiring) {
      $scope.query.update({
        paginationWindow: $scope.query.paginationWindow + 30
      });
    }
  };
});

controllers.controller('messageListItemCtrl', function ($scope) {

  /**
   * Get initials from sender
   *
   * @method
   * @param  {Object} message - Message object or instance
   * @return {string} - User's display name
   */
  $scope.getSenderInitials = function(message) {
    var name = message.sender.userId || '';
    return name.substr(0, 2).toUpperCase();
  };

  /**
   * Get the message's read/delivered status.  For this
   * simple example we ignore delivered (see `message.deliveryStatus`).
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Message-property-readStatus
   *
   * @method
   * @param  {Object} message - Message object or instance
   * @return {string} - Message to display in the status node
   */
  $scope.getMessageStatus = function(message) {
    switch (message.readStatus) {
      case 'NONE':
        return 'unread';
      case 'SOME':
        return 'read by some';
      case 'ALL':
        return 'read';
    }
  };

  /**
   * Get the message sentAt string in a nice renderable format.
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Message-property-sentAt
   *
   * @method
   * @param  {Object} message - Message object or instance
   * @return {string} - Message to display in the sentAt node
   */
  $scope.getMessageDate = function(message) {
    return window.layerSample.dateFormat(message.sentAt);
  };
});
