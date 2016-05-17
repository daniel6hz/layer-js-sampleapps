import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

export default class Avatar extends Component {

  static propTypes = {
    user: PropTypes.object,
    users: PropTypes.array
  }

  renderUserItem = (user) => {
    return <span key={user.id}><img src={user.avatarUrl} /></span>;
  }

  render() {
    const { user, users } = this.props;
    let usersToRender = user ? [user] : users.slice(-2);
    let styles = cx({
      'avatar-image': true,
      cluster: usersToRender && usersToRender.length > 1
    });

    return <div className={styles}>{usersToRender.map(this.renderUserItem)}</div>;
  }
}
