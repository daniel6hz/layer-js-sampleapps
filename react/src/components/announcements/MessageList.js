import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import MessageListItem from './MessageListItem';

/**
 * A Component for rendering a list of Messages.
 * But most of the work here is managing the scrolling
 * position, and calling this.props.onLoadMoreMessages()
 * to page in more messages.
 */
export default class MessageList extends Component {

  renderMessageItem = (message) => {
    const { onMarkMessageRead } = this.props;

    return (
      <MessageListItem
        key={message.id}
        message={message}
        onMarkMessageRead={onMarkMessageRead}/>
    );
  }

  render() {
    const messages = this.props.messages;

    return (
      <div className='announcement-list-container'>
        <div className="panel-header">
            <span className="title">Announcements</span>
        </div>
        <div className='announcement-list'>
          {messages.map(this.renderMessageItem)}
        </div>
      </div>
    );
  }
}
