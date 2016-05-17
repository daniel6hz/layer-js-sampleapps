import React, { Component, PropTypes } from 'react';
import UserListItem from './UserListItem';

/**
 * This Component renders a list of users,
 * currently provided by UserListItems which
 * allow the UI to provide a New Conversation panel.
 */
export default class UserList extends Component {
  renderUserItem = (user) => {
    const { selectedUsers, onUserSelected, onUserUnselected } = this.props;
    const selected = selectedUsers.indexOf(user.userId) !== -1;

    return (
      <UserListItem
        key={user.id}
        user={user}
        selected={selected}
        onUserSelected={onUserSelected}
        onUserUnselected={onUserUnselected}/>
    );
  }

  render() {
    return (
      <div className="user-list">
        {this.props.users.map(this.renderUserItem)}
      </div>
    );
  }
}
