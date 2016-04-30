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
    var text = $scope.sendText;
    $scope.sendText = '';
    var conversationInstance = $scope.appCtrlState.client.getConversation($scope.chatCtrlState.currentConversation.id);
    if (conversationInstance) {
      var message;
      if (text.indexOf('> ') === 0) {
        message = conversationInstance.createMessage({
          parts: [{
            mimeType: 'text/quote',
            body: text.substring(2)
          }]
        });
      } else {
        message = conversationInstance.createMessage(text);
      }
      message.send();
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
