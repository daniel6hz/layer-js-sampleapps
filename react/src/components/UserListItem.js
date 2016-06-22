import React, { Component, PropTypes } from 'react';
import Avatar from './Avatar';

/**
 * This Component renders a User in the form of an
 * Avatar, name and checkbox.  Calls onUserSelected
 * and onUserUnselected as checkbox state changes.
 */
export default class UserListItem extends Component {
  handleClick = () => {
    const user = this.props.user;

    if (this.props.selected) {
      this.props.onUserUnselected(user);
    } else {
      this.props.onUserSelected(user);
    }
  }

  render() {
    const { user, selected } = this.props;
    return (
      <div className='participant' onClick={this.handleClick}>
        <Avatar user={user}/>
        <div className='info'>
          <div className='main'>
            <label className='title'>{user.displayName}</label>
            <input type='checkbox' checked={selected}/>
          </div>
        </div>
      </div>
    );
  }
}
