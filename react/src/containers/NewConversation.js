import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect as connectRedux } from 'react-redux';
import * as MessengerActions from '../actions/messenger';
import ConversationHeader from '../components/ConversationHeader';
import UserList from '../components/UserList';
import MessageComposer from '../components/MessageComposer';
import { QueryBuilder } from 'layer-sdk';
import { connectQuery } from 'layer-react';

function mapStateToProps({ newConversationState }) {
  return { newConversationState };
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(MessengerActions, dispatch) };
}

@connectRedux(mapStateToProps, mapDispatchToProps)
export default class NewConversation extends Component {
  render() {
    const { newConversationState, users, actions } = this.props;
    const {
      changeConversationTitle,
      addParticipant,
      removeParticipant,
      changeComposerMessage,
      submitComposerMessage
    } = actions;
    const { title, participants, composerMessage } = newConversationState;
    const composerVisible = participants.length > 0;
    const selectedUsers = participants;

    // Render the ConversationHeader, UserList and MessageComposer
    return (
      <div className='right-panel'>
        <ConversationHeader
          title={title}
          selectedUsers={selectedUsers}
          editingNewConversation={true}
          onChangeConversationTitle={changeConversationTitle}/>

        <UserList
          users={users}
          selectedUsers={selectedUsers}
          onUserSelected={addParticipant}
          onUserUnselected={removeParticipant}/>

        {composerVisible &&
          <MessageComposer
            value={composerMessage}
            onChange={changeComposerMessage}
            onSubmit={submitComposerMessage}/>}
      </div>
    );
  }
}
