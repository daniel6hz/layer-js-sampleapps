/* global angular layer */
'use strict';

var controllers = angular.module('messageItemControllers', []);


controllers.controller('messageListItemCtrl', function ($scope) {
  // Used by announcements only
  $scope.closed = true;

  $scope.toggleMessageOpen = function() {
    setTimeout(function() {
      var message = $scope.appCtrlState.client.getMessage($scope.message.id);
      if (message) message.isRead = true;
    }, 1);
    $scope.closed = !$scope.closed;
  };


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

  $scope.getPartTemplate = function(part) {
    return part.mimeType.replace(/[^a-zA-Z]/g, '') + 'Part.html';
  };
});