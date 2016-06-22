import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';
import * as MessengerActions from '../actions/messenger';
import ConversationList from '../components/ConversationList';
import ConversationListHeader from '../components/ConversationListHeader';
import AnnouncementsList from '../components/announcements/MessageList';

function mapStateToProps({ app, announcementState, router }) {
  return {
    app,
    announcementState,
    activeConversationId: `layer:///conversations/${router.params.conversationId}`,
  };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

function getQueries() {
  return {
    conversations: QueryBuilder.conversations(),
    announcements: QueryBuilder.announcements(),
    users: QueryBuilder.identities(),
  };
}

/**
 * connectQuery adds a conversations property containing
 * all conversations returned by the Conversation Query.
 */
@connect(mapStateToProps, mapDispatchToProps)
@connectQuery({}, getQueries)
export default class Messenger extends Component {
  hideAnnouncements = (event) => {
    const { actions } = this.props;
    const { hideAnnouncements } = actions;
    if (event.target.parentNode.className === 'announcements-dialog') {
      hideAnnouncements();
    }
  }

  renderMessenger() {
    const { app, activeConversationId, actions, announcementState,
            users, conversations, announcements } = this.props;
    const { newConversation, deleteConversation, showAnnouncements, markMessageRead } = actions;

    // Render the left-panel which contains the Conversation List
    // and the right-panel which consists of the child components
    // (currently IndexRoute, Route with NewConversation and Route with ActiveConversation)
    return (
      <div className='messenger'>
        <div className='left-panel'>
          <ConversationListHeader
            owner={app.owner}
            unreadAnnouncements={Boolean(announcements.filter(item => item.isUnread).length)}
            onShowAnnouncements={showAnnouncements}
            onNewConversation={newConversation}/>
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            onDeleteConversation={deleteConversation}/>
        </div>
        {this.props.children && React.cloneElement(this.props.children, {
          conversations,
          users
        })}
        {announcementState.showAnnouncements ?
          <div
            onClick={this.hideAnnouncements}
            className="announcements-dialog">
              <div>
                <AnnouncementsList
                  messages={announcements}
                  onMarkMessageRead={markMessageRead}/>
              </div>
        </div>
        : <span />}
      </div>
    );
  }

  renderEmptyScreen() {
    return (
      <div className='messenger'></div>
    );
  }

  /**
   * If we are ready, render the Messenger, else render a blank screen
   */
  render() {
    if (this.props.app.ready) {
      return this.renderMessenger();
    } else {
      return this.renderEmptyScreen();
    }
  }
}
