import React, { Component, PropTypes } from 'react';
import ConversationListItem from './ConversationListItem';

export default class ConversationList extends Component {

  /**
   * Function for rendering a Conversation in the Conversation List.
   */
  renderConversationListItem = (conversation) => {
    const {
      activeConversationId,
      onDeleteConversation
    } = this.props;

    return (
      <ConversationListItem
        key={conversation.id}
        conversation={conversation}
        active={activeConversationId === conversation.id}
        onDeleteConversation={onDeleteConversation} />
    );
  }

  /**
   * Render every Conversation in this.props.conversations
   * in the Conversation List.
   */
  render() {
    const { conversations } = this.props;

    return (
      <div className="conversation-list">
        {conversations.map(this.renderConversationListItem)}
      </div>
    );
  }
}
