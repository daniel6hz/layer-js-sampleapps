import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import MessageListItem from './MessageListItem';
import throttledEventListener from '../../utils/throttledEventListener';

/**
 * A Component for rendering a list of Messages.
 * But most of the work here is managing the scrolling
 * position, and calling this.props.onLoadMoreMessages()
 * to page in more messages.
 */
export default class MessageList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      stickBottom: true
    };
  }

  componentDidMount() {
    this.removeScrollListener = throttledEventListener(findDOMNode(this), 'scroll', this.handleScroll, this);
    this.removeResizeListener = throttledEventListener(window, 'resize', this.handleScroll, this);
    this.scrollBottom();
  }

  componentDidUpdate() {
    if (this.state.stickBottom) {
      this.scrollBottom();
    }
  }

  scrollBottom() {
    if (!this.state.isScrolling) {
      var el = findDOMNode(this);
      el.scrollTop = el.scrollHeight;
    }
  }

  handleScroll() {
    var el = findDOMNode(this);
    if (el.scrollTop === 0) {
      this.props.onLoadMoreMessages();
    }

    const stickBottom = el.scrollHeight - 1 <= el.clientHeight + el.scrollTop;

    if (stickBottom !== this.state.stickBottom) {
      this.setState({ stickBottom });
    }

  }

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
    const reversedMessages = this.props.messages.concat().reverse();

    return (
      <div className='message-list'>
        {reversedMessages.map(this.renderMessageItem)}
      </div>
    );
  }

  componentWillUnmount() {
    this.removeResizeListener();
    this.removeScrollListener();
  }
}
