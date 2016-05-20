import React, { Component } from 'react';

/**
 * This Component provides a title over the conversation list
 * and a button for creating a new Conversation.
 */
export default class ConversationListHeader extends Component {
  handleNewConversation = (event) => {
    event.preventDefault();
    this.props.onNewConversation();
  }

  showAnnouncements = (event) => {
    event.preventDefault();
    this.props.onShowAnnouncements();
  }

  render() {
    const { unreadAnnouncements, owner } = this.props;
    const announcementClasses = ['announcements-button'];
    if (unreadAnnouncements) announcementClasses.push('unread-announcements');
    return (
      <div className='panel-header conversations-header'>
        <div className='title'>{owner.displayName}'s Conversations</div>
        <a className={announcementClasses.join(' ')} onClick={this.showAnnouncements}>
          <i className="icon fa fa-bullhorn"></i>
        </a>
        <a href='#' onClick={this.handleNewConversation}>
          <i className="icon fa fa-pencil-square-o"></i>
        </a>
      </div>
    );
  }
}
