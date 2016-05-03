import React, { Component, PropTypes } from 'react';
import TextMessagePart from './TextMessagePart';
import Avatar from '../Avatar';

/**
 * This Component renders a single Message in a Message List
 * which includes Avatar, sender name, message body,
 * timestamp and status.
 */
export default class MessageListItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      closed: true,
    };
  }

  /**
   * At this time we are marking any Message that has been
   * rendered as read.  A more advanced implementation
   * would test if was scrolled into view.
   */
  markMessageRead() {
    const { onMarkMessageRead, message } = this.props;
    if (message.isUnread) {
      onMarkMessageRead(message.id);
    }
  }

  showItem = (event) => {
    this.setState({ closed: !this.state.closed });
    this.markMessageRead();
  }

  render() {
    const { message, users } = this.props;

    return (
      <div className={"announcement-item " + (message.isRead ? "is-read" : "is-unread")} onClick={this.showItem}>
        <div className={"unread-bullet " + (message.isRead ? "" : "fa fa-circle")}/>
        <div className='name'>{message.sender.name}</div>

        <div className={"announcement-parts " + (this.state.closed ? "closed" : "")}>
          {message.parts.map((messagePart) => {
            return (
              <TextMessagePart
                key={messagePart.id}
                messagePart={messagePart}/>
            )
          })}
        </div>
        <div className='timestamp'>
          {window.layerSample.dateFormat(message.sentAt)}
        </div>
      </div>
    );
  }
}
