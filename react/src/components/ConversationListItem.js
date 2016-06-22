import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import cx from 'classnames';
import toUUID from '../utils/toUUID';
import Avatar from './Avatar';

/**
 * This Component provides for a Conversation item
 * in the list, currently consisting of an
 * Avatar, title and Delete button.
 */
export default class ConversationListItem extends Component {
  handleDeleteConversation = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDeleteConversation(this.props.conversation.id);
  }

  render() {
    const { conversation, active, deleteConversation } = this.props;
    const participantUsers = conversation.participants.filter(user => !user.sessionOwner);
    const conversationUrl = `/conversations/${toUUID(conversation.id)}`;

    const styles = cx({
      participant: true,
      'unread-messages': conversation.unreadCount > 0,
      'selected-conversation': active
    });

    const title = conversation.metadata.title || participantUsers.map(function(user) {
      return user.displayName;
    }).join(', ');
    return (
      <Link to={conversationUrl} className={styles}>
        <Avatar users={participantUsers}/>
        <div className='info'>
          <div className='main'>
            <span className='title'>{title}</span>
            <span
              className="delete fa fa-times-circle"
              title="Delete conversation"
              onClick={this.handleDeleteConversation}/>
          </div>
        </div>
      </Link>
    );
  }
}
