import { TypingIndicators } from 'layer-sdk';
import {
  SUBMIT_COMPOSER_MESSAGE,
  SAVE_CONVERSATION_TITLE,
  MARK_MESSAGE_READ,
  CHANGE_COMPOSER_MESSAGE,
  ROUTER_DID_CHANGE,
  DELETE_CONVERSATION,
  clientReady,
  selectConversation
} from '../actions/messenger';

const {
  STARTED,
  FINISHED
} = TypingIndicators;

function handleAction(layerClient, typingPublisher, state, action, next) {
  const { type, payload } = action;

  switch(type) {
    case SUBMIT_COMPOSER_MESSAGE: {
      let conversation;
      if (state.router.location.pathname === '/new') {
        const { participants, title } = state.newConversation;
        const { users } = state.app;
        const distinct = title.length === 0;
        const metadataTitle = title || '';

        conversation = layerClient.createConversation({
          distinct,
          participants,
          metadata: {
            title:  metadataTitle
          }
        });

        conversation.on('conversations:sent', () => {
          next(selectConversation(conversation.id));
        });

        conversation.createMessage(state.newConversation.composerMessage).send();
      } else {
        typingPublisher.setState(FINISHED);

        conversation = layerClient
          .getConversation(`layer:///conversations/${state.router.params.conversationId}`, true);
      }

      const text = state.newConversation.composerMessage;
      let message;
      if (text.indexOf('> ') === 0) {
        message = conversation.createMessage({
          parts: [{
            mimeType: 'text/quote',
            body: text.substring(2)
          }]
        });
      } else {
        message = conversation.createMessage(text);
      }
      message.send();

      return;
    }
    case SAVE_CONVERSATION_TITLE:
      layerClient
        .getConversation(`layer:///conversations/${state.router.params.conversationId}`, true)
        .setMetadataProperties({ title: state.activeConversation.title });
      return;
    case MARK_MESSAGE_READ:
      layerClient
        .getMessage(payload.messageId).isRead = true;
      return;
    case CHANGE_COMPOSER_MESSAGE:
      if (state.router.location.pathname !== '/new') {
        const conversationId = `layer:///conversations/${state.router.params.conversationId}`;
        const composerMessage = state.activeConversation.composerMessage;
        const typingState = composerMessage.length > 0 ? STARTED : FINISHED;

        if (!typingPublisher.conversation || typingPublisher.conversation.id !== conversationId) {
          typingPublisher.setConversation({ id: conversationId });
        }
        typingPublisher.setState(typingState);
      }
      return;
    case DELETE_CONVERSATION:
      const conversation = layerClient
        .getConversation(payload.conversationId);

      if (confirm('Are you sure you want to delete this conversation?')) {
        conversation.delete(layer.Constants.DELETION_MODE.ALL);
      }
      return;
    default:
      return;
  }
}

const layerMiddleware = layerClient => store => {

  const typingPublisher = layerClient.createTypingPublisher();

  layerClient.on('ready', () => {
    store.dispatch(clientReady());
  });

  return next => action => {
    const state = store.getState();

    handleAction(layerClient, typingPublisher, state, action, next);

    const nextState = next(action);

    return nextState;
  };
};

export default layerMiddleware;
