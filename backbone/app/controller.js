/* global layer */
'use strict';

var Backbone = require('backbone');

var ConversationsView = require('./views/conversations');
var MessagesView = require('./views/messages');
var TitlebarView = require('./views/titlebar');
var SendView = require('./views/send');
var TypingIndicatorView = require('./views/typingindicator');
var ParticipanstView = require('./views/participants');
var AnnouncementsView = require('./views/announcements');

/**
 * Client router
 */
var Router = Backbone.Router.extend({
  routes: {
    'conversations/new': 'conversation:new',
    'conversations/:id': 'conversation:selected',
    'announcements': 'announcements'
  }
});
var router = new Router();

/**
 * Controller initializer
 */
module.exports = function(client) {
  var activeConversationId = null;
  var newConversation = {};

  var conversationsView = new ConversationsView();
  var messagesView = new MessagesView();
  var titlebarView = new TitlebarView();
  var sendView = new SendView();
  var typingindicatorView = new TypingIndicatorView();
  var participantView = new ParticipanstView();
  var announcementsView = new AnnouncementsView();

  /**
   * Create Conversation List Query
   */
  var conversationQuery = client.createQuery({
    model: layer.Query.Conversation
  });

  /**
   * Create Message List Query
   */
  var messagesQuery = client.createQuery({
    model: layer.Query.Message,
    paginationWindow: 30
  });

  /**
   * Create Announcements Query
   */
  var announcementsQuery = client.createQuery({
    model: layer.Query.Announcement,
    paginationWindow: 30
  });

  /**
   * Create Identity List Query
   */
  var identityQuery = client.createQuery({
    model: layer.Query.Identity
  });

  /**
   * Any time a query data changes we should rerender.  Data changes when:
   *
   * * The Query data has loaded from the server
   * * A new Conversation/Message is created and added to the results
   * * A Conversation/Message is deleted and removed from the results
   * * Any properties of objects in the results have changed
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Query
   */
  conversationQuery.on('change', function() {
    conversationsView.conversations = conversationQuery.data;
    conversationsView.render();

    titlebarView.render();
  });
  messagesQuery.on('change', function(e) {
    switch (e.type) {
      case 'data':
      case 'property':
        messagesView.messages = messagesQuery.data;
        messagesView.render();
        break;
      case 'insert':
        messagesView.addMessage(e.target);
        break;
    }
  });
  announcementsQuery.on('change', function(e) {
    switch (e.type) {
      case 'data':
      case 'insert':
        announcementsView.announcements = announcementsQuery.data;
        announcementsView.render();
        break;
      case 'property':
        break;
    }

    // Mark unread announcements
    var unread = announcementsQuery.data.filter(function(item) {
      return !item.isRead;
    });
    Backbone.$('.announcements-button').toggleClass('unread-announcements', unread.length > 0);
  });
  identityQuery.on('change', function(evt) {
    if (evt.type === 'data') {
      window.layerSample.validateSetup(client);
    }
    participantView.users = identityQuery.data;
    renderAll(); // new Identities can affect rendering of many panels
  });

  /**
   * Any typing indicator events received from the client
   * should cause the typing indicator view to be rerendered.
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Client-event-typing-indicator-change
   */
  client.on('typing-indicator-change', function(e) {
    if (e.conversationId === activeConversationId) {
      typingindicatorView.typing = e.typing;
    }
    typingindicatorView.render();
  });

  /**
   * Publish typing indicators on receiving typing events
   * from the UI.  Publishing them allows other participants
   * to see them.
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.TypingIndicators.TypingPublisher
   */
  var typingPublisher = client.createTypingPublisher();
  sendView.on('typing:started', function() {
    typingPublisher.setState(layer.TypingIndicators.STARTED);
  });
  sendView.on('typing:finished', function() {
    typingPublisher.setState(layer.TypingIndicators.FINISHED);
  });

  /**
   * View event listeners
   */
  conversationsView.on('conversation:delete', function(conversationId) {
    var conversation = client.getConversation(conversationId);
    if (confirm('Are you sure you want to delete this conversation?')) {
      conversation.delete(layer.Constants.DELETION_MODE.ALL);
    }
  });
  messagesView.on('messages:paginate', function() {
    messagesQuery.update({
      paginationWindow: messagesQuery.paginationWindow + 30
    });
  });
  titlebarView.on('conversation:title', function(title) {
    newConversation.metadata = { title: title };
  });
  participantView.on('conversation:participants', function(participants) {
    newConversation.participants = participants;
    newConversation.distinct = participants.length === 1;
  });
  sendView.on('conversation:create', function(text) {
    // See http://static.layer.com/sdk/docs/#!/api/layer.Conversation
    var conversation = client.createConversation(newConversation);
    conversation.createMessage(text).send();

    // Update our location.
    var uuid = conversation.id.substr(conversation.id.lastIndexOf('/') + 1);
    router.navigate('conversations/' + uuid, {trigger: true});
    conversation.on('conversations:sent', function() {
      // A Conversation ID may change after its sent
      // if the server returns a matching Distinct Conversation.
      var uuid = conversation.id.substr(conversation.id.lastIndexOf('/') + 1);
      if (location.hash !== '#conversations/' + uuid) {
        router.navigate('conversations/' + uuid, {trigger: true});
      }
    });
  });

  /**
   * Routing
   */
  router.on('route:conversation:selected', function(uuid) {
    activeConversationId = 'layer:///conversations/' + uuid;
    var conversation = client.getConversation(activeConversationId, true);

    // Update the Message Query to load the new Conversation
    messagesQuery.update({
      predicate: 'conversation.id = "' + activeConversationId + '"'
    });

    conversationsView.conversation = conversation;
    messagesView.conversation = conversation;
    titlebarView.conversation = conversation;
    sendView.conversation = conversation;

    typingPublisher.setConversation(conversation);
    renderAll();
    participantView.hide();
  });

  router.on('route:conversation:new', function() {
    newConversation = {};

    conversationsView.newConversation();
    messagesView.newConversation();
    titlebarView.newConversation();
    sendView.newConversation();
    participantView.newConversation();
  });

  router.on('route:announcements', function() {
    announcementsView.show();
  });

  function renderAll() {
    conversationsView.render();
    messagesView.render();
    titlebarView.render();
    sendView.render();
    participantView.render();
  }

  if (window.location.hash) Backbone.history.loadUrl(Backbone.history.fragment);
};

Backbone.history.start();
