/* global angular layer */
'use strict';

var controllers = angular.module('conversationListControllers', []);

/**
 * The Conversation List Controller manages the List of Conversation on
 * the left column.
 *
 * This Controller manages the Conversation Query which delivers
 * all Conversations and any changes to the Conversations.
 *
 * Rendering is done by iterating over $scope.query.data
 */
controllers.controller('conversationListCtrl', function ($scope, $rootScope) {


  // Create the Conversation List query
  $scope.query = $scope.appCtrlState.client.createQuery({
    model: layer.Query.Conversation,
    dataType: 'object',
    paginationWindow: 500
  });

  /**
   * Any time the query data changes, rerender.  Data changes when:
   *
   * * The Conversation data has loaded from the server
   * * A new Conversation is created and added to the results
   * * A Conversation is deleted and removed from the results
   * * Any Conversation in the results has a change of metadata or participants
   */
  $scope.query.on('change', function() {
    $rootScope.$digest();
  });

  /**
   * This deletes a Conversation from the server.
   */
  $scope.deleteConversation = function(conversation) {
    var conversationInstance = $scope.appCtrlState.client.getConversation(conversation.id);
    if (conversationInstance) {
      window.setTimeout(function() {
        if (confirm('Are you sure you want to delete this conversation?')) {
          conversationInstance.delete(layer.Constants.DELETION_MODE.ALL);
        }
      }, 1);
    }
  };
});