/* global angular layer */
'use strict';

var sampleControllers = angular.module('sampleAppControllers', []);

/**
 * Notes: data in this application is driven by Queries.  Queries can be set
 * to return Conversation and Message Objects or Instances.  An Object
 * lets us have an immutable object that simplifies angular's scope comparisons.
 * An Instance provides methods that let us interact with the layer services.
 * Both are used in this application: Objects for managing angular state, Instances for interacting.
 */

var identityReady;

/**
 * Wait for identity dialog message to complete
 */
window.addEventListener('message', function(evt) {
  if (evt.data === 'layer:identity') {
    identityReady();
  }
});

/**
 * The Main Application Controller initializes the client
 * and loads the Chat Controller
 */
sampleControllers.controller('appCtrl', function ($scope) {
  $scope.appCtrlState = {
    isReady: false,
    client: null
  };

  /**
   * Start by creating a client; it will authenticate asynchronously,
   * so the UI needs to account for the fact that it won't have any data
   * when first rendering.
   */
  identityReady = function() {

    /**
     * Initialize Layer Client with `appId`
     */
    window.client = $scope.appCtrlState.client = new layer.Client({
      appId: window.layerSample.appId
    });

    /**
     * Client authentication challenge.
     * Sign in to Layer sample identity provider service.
     */
    $scope.appCtrlState.client.on('challenge', function(evt) {
      window.layerSample.challenge(evt.nonce, evt.callback);
    });

    /**
     * Once the client is ready, get our users (static data
     * for this sample) and render.
     */
    $scope.appCtrlState.client.on('ready', function() {
      $scope.appCtrlState.isReady = true;
      $scope.appCtrlState.users = window.layerSample.users;
      $scope.appCtrlState.user = window.layerSample.user;
      $scope.$digest();
    });
  };
});

/**
 * The Main Application Controller manages:
 * 1. Whether to show the userList or the messages panel
 * 2. All routing (current conversation or new conversation)
 */
sampleControllers.controller('chatCtrl', function ($scope, $route, $location) {
  window.tmp = $scope.chatCtrlState = {
    showUserList: false,
    showAnnouncements: false,
    currentConversation: null
  };

  /**
   * Get the Conversation from cache... or from the server if not cached.
   * Once loaded, set it as our currentConversation.
   */
  $scope.loadConversation = function loadConversation(id) {
    var conversation = $scope.appCtrlState.client.getConversation(id, true);
    conversation.once('conversations:loaded', function() {
      $scope.chatCtrlState.currentConversation = conversation.toObject();
      $scope.$digest();
      document.querySelectorAll('.message-textarea')[0].focus();
    });
  };

  /*
   * Whenever the url changes, Load the requested Conversation
   * (if any), update our state and render
   */
  function handleLocation() {
    var matches = $location.$$url.match(/\/conversations\/.{8}-.{4}-.{4}-.{4}-.{12}$/);

    // If the url matches a Conversation URL, show it.
    if (matches) {
      if ($scope.appCtrlState.isReady) {
        $scope.loadConversation('layer://' + matches[0]);
      } else {
        $scope.$watch('appCtrlState.isReady', function() {
          $scope.loadConversation('layer://' + matches[0]);
        });
      }
      $scope.chatCtrlState.showUserList = false;
    }

    // If the URL matches a new Conversation, show the Create Conversation UI
    // and insure all checkboxes are clear.
    else if ($location.$$url.match(/\/conversations\/new$/)) {
      $scope.chatCtrlState.showUserList = true;
      $scope.chatCtrlState.currentConversation = null;
      Array.prototype.slice.call(document.querySelectorAll('.user-list :checked'))
        .forEach(function(node) {
          node.checked = false;
        });
    }
  }

  $scope.$on('$locationChangeSuccess', handleLocation);

  // Handle the initial url state we loaded the app with.
  handleLocation();

  /**
   * Utility for rendering all users in a Conversation.
   */
  $scope.getConversationAvatars = function(conversationObject) {
    return conversationObject.participants.map(function(participant) {
      return participant.substr(0, 2).toUpperCase();
    });
  };

  /**
   * Utility for getting the title for a Conversation
   */
  $scope.getConversationTitle = function(conversationObject) {
    if (conversationObject) {
      // Metadata.title is the preferred title
      if (conversationObject.metadata.title) return conversationObject.metadata.title;

      // A join of all participants names is the backup title.
      return conversationObject.participants.join(', ');
    }
    return '';
  };
});

/**
 * The Conversation List Controller manages the List of Conversation on
 * the left column.
 *
 * This Controller manages the Conversation Query which delivers
 * all Conversations and any changes to the Conversations.
 *
 * Rendering is done by iterating over $scope.query.data
 */
sampleControllers.controller('conversationListCtrl', function ($scope, $rootScope) {
  // Once we are authenticated and the User list is loaded, create the query
  $scope.$watch('appCtrlState.isReady', function(newValue) {
    if (newValue) {

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
    }
  }, this);

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
