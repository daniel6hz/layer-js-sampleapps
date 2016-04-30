/* global angular layer */
'use strict';

var controllers = angular.module('messageListControllers', []);

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
          }).filter(function(item) {
            return item;
          })
          .forEach(function(m) {
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

controllers.controller('announcementDialogCtrl', function($scope, $rootScope) {
    var dialog = document.querySelectorAll('.announcements-dialog')[0];
    dialog.addEventListener('click', function(evt) {
        if (evt.target === dialog || evt.target.parentNode === dialog) {
            $scope.chatCtrlState.showAnnouncements = false;
            $rootScope.$digest();
        }
    });
});

controllers.controller('announcementListCtrl', function($scope, $rootScope) {
  // Store all message data here
  $scope.data = [];

  // Create the Messages Query
  $scope.query = $scope.appCtrlState.client.createQuery({
    model: layer.Query.Announcement,
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

      $scope.data = $scope.query.data.concat([]);

      $scope.chatCtrlState.unreadAnnouncements = $scope.data.filter(function(item) {
        return !item.isRead;
      }).length;

      if ($scope.data.length && $scope.data[$scope.data.length - 1].isUnread) {
        $scope.chatCtrlState.showAnnouncements = true;
        $rootScope.$digest();
      }

      // Any time the query's data changes, rerender.
      if ($scope.$$phase !== '$digest') {
        $scope.$digest();
      }
    }
  });

  $scope.$watch('chatCtrlState.showAnnouncements', function(newValue) {
    if (newValue) {
        // Force ng-infinite-scroll to do its thing
        $scope.data = $scope.data.concat([]);
    }
  });
});
