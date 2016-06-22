import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../actions/messenger';
import ConversationHeader from '../components/ConversationHeader';
import MessageList from '../components/messages/MessageList';
import MessageComposer from '../components/MessageComposer';
import TypingIndicatorContainer from './TypingIndicatorContainer';

function mapStateToProps({ activeConversation, router }) {
  return {
    ...activeConversation,
    activeConversationId: `layer:///conversations/${router.params.conversationId}`
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

function getQueries({ activeConversationId, messagePagination }) {
  return {
    messages: QueryBuilder
      .messages()
      .forConversation(activeConversationId)
      .paginationWindow(messagePagination)
  };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class ActiveConversation extends Component {

  render() {
    const {
      editingTitle,
      title,
      composerMessage,
      activeConversationId,
      conversations,
      messages,
      actions
    } = this.props;
    const {
      editConversationTitle,
      changeConversationTitle,
      saveConversationTitle,
      cancelEditConversationTitle,
      loadMoreMessages,
      changeComposerMessage,
      submitComposerMessage,
      markMessageRead
    } = actions;

    const activeConversation = conversations.find((conversation) => {
      return conversation.id === activeConversationId;
    });

    // Render the ConversationHeader, MessageList,
    // TypingIndicatorContainer and MessageComposer
    return (
      <div className='right-panel'>
        <ConversationHeader
          title={title}
          activeConversation={activeConversation}
          editingTitle={editingTitle}
          onEditConversationTitle={editConversationTitle}
          onChangeConversationTitle={changeConversationTitle}
          onSaveConversationTitle={saveConversationTitle}
          onCancelEditConversationTitle={cancelEditConversationTitle}/>

        <MessageList
          messages={messages}
          onMarkMessageRead={markMessageRead}
          onLoadMoreMessages={loadMoreMessages}/>

        <TypingIndicatorContainer
          conversationId={activeConversationId}/>

        <MessageComposer
          value={composerMessage}
          onChange={changeComposerMessage}
          onSubmit={submitComposerMessage}/>
      </div>
    );
  }
}
