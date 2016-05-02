import { pushState } from 'redux-router';
import toUUID from '../utils/toUUID';

export const CLIENT_READY = 'CLIENT_READY';
export const CHANGE_COMPOSER_MESSAGE = 'CHANGE_COMPOSER_MESSAGE';
export const SUBMIT_COMPOSER_MESSAGE = 'SUBMIT_COMPOSER_MESSAGE';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const NEW_CONVERSATION = 'NEW_CONVERSATION';
export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const REMOVE_PARTICIPANT = 'REMOVE_PARTICIPANT';
export const EDIT_CONVERSATION_TITLE = 'EDIT_CONVERSATION_TITLE';
export const CANCEL_EDIT_CONVERSATION_TITLE = 'CANCEL_EDIT_CONVERSATION_TITLE';
export const CHANGE_CONVERSATION_TITLE = 'CHANGE_CONVERSATION_TITLE';
export const SAVE_CONVERSATION_TITLE = 'SAVE_CONVERSATION_TITLE';
export const MARK_MESSAGE_READ = 'MARK_MESSAGE_READ';
export const LOAD_MORE_MESSAGES = 'LOAD_MORE_MESSAGES';
export const ROUTER_DID_CHANGE = '@@reduxReactRouter/routerDidChange';
export const DELETE_CONVERSATION = 'DELETE_CONVERSATION';
export const SHOW_ANNOUNCEMENTS = 'SHOW_ANNOUNCEMENTS';
export const HIDE_ANNOUNCEMENTS = 'HIDE_ANNOUNCEMENTS';

export function clientReady() {
  return {
    type: CLIENT_READY
  };
}

export function selectConversation(conversationId) {
  return pushState(null, `/conversations/${toUUID(conversationId)}`);
}

export function deleteConversation(conversationId) {
  return {
    type: DELETE_CONVERSATION,
    payload: {
      conversationId
    }
  };
}

export function changeComposerMessage(value) {
  return {
    type: CHANGE_COMPOSER_MESSAGE,
    payload: {
      value
    }
  };
}

export function submitComposerMessage() {
  return {
    type: SUBMIT_COMPOSER_MESSAGE
  };
}

export function fetchUsersSuccess(users) {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: {
      users
    }
  };
}

export function goHome() {
  return pushState(null, '/');
}

export function newConversation() {
  return pushState(null, '/new');
}

export function addParticipant(userId) {
  return {
    type: ADD_PARTICIPANT,
    payload: {
      userId
    }
  };
}

export function removeParticipant(userId) {
  return {
    type: REMOVE_PARTICIPANT,
    payload: {
      userId
    }
  };
}

export function editConversationTitle() {
  return {
    type: EDIT_CONVERSATION_TITLE
  };
}

export function cancelEditConversationTitle() {
  return {
    type: CANCEL_EDIT_CONVERSATION_TITLE
  };
}

export function changeConversationTitle(title) {
  return {
    type: CHANGE_CONVERSATION_TITLE,
    payload: {
      title
    }
  };
}

export function saveConversationTitle() {
  return {
    type: SAVE_CONVERSATION_TITLE
  };
}

export function loadMoreMessages() {
  return {
    type: LOAD_MORE_MESSAGES
  };
}

export function markMessageRead(messageId) {
  return {
    type: MARK_MESSAGE_READ,
    payload: {
      messageId
    }
  }
}


export function showAnnouncements() {
  return {
    type: SHOW_ANNOUNCEMENTS
  };
}

export function hideAnnouncements() {
  return {
    type: HIDE_ANNOUNCEMENTS
  };
}
