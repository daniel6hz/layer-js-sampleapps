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
    $scope.appCtrlState.client = new layer.Client({
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
      $scope.appCtrlState.users = [];
      $scope.appCtrlState.user = window.layerSample.user;
    });

    // Create the User List query
    var identityQuery = $scope.appCtrlState.client.createQuery({
      model: layer.Query.Identity,
      dataType: 'object',
      paginationWindow: 500,
      change: function(evt) {
        // This query won't run until the client "ready" event has triggered;
        // and the query's "change" event won't trigger until it runs.
        // While it is not required to wait, we wait until Identities have loaded before we
        // start rendering the UI
        $scope.appCtrlState.isReady = true;
        $scope.appCtrlState.users = identityQuery.data.filter(function(user) {
          return user.id !== $scope.appCtrlState.client.user.id;
        });
        $scope.$digest();
        if (evt.type === 'data') {
          window.layerSample.validateSetup($scope.appCtrlState.client);
        }
      }
    });

    $scope.appCtrlState.client.connect(window.layerSample.userId);
  };
});

/**
 * The Main Application Controller manages:
 * 1. Whether to show the userList or the messages panel
 * 2. All routing (current conversation or new conversation)
 */
sampleControllers.controller('chatCtrl', function ($scope, $route, $location) {
  $scope.chatCtrlState = {
    showUserList: false,
    showAnnouncements: false,
    unreadAnnouncements: 0,
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
      if ($scope.appCtrlState.client.isReady) {
        $scope.loadConversation('layer://' + matches[0]);
      } else {
        $scope.appCtrlState.client.once('ready', function() {
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
   * Utility for getting the title for a Conversation
   */
  $scope.getConversationTitle = function(conversationObject) {
    if (conversationObject) {
      // Metadata.title is the preferred title
      if (conversationObject.metadata.title) return conversationObject.metadata.title;

      // A join of all participants names is the backup title.
      return conversationObject.participants.map(function(identity) {
        return identity.displayName;
      }).join(', ');
    }
    return '';
  };
});

