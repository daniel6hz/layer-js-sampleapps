import React, { Component } from 'react';

const ENTER = 13;

export default class ConversationHeader extends Component {

  /**
   * User has begun editing the title; call the provided callback.
   */
  handleEditTitle = (event) => {
    event.preventDefault();
    this.props.onEditConversationTitle();
  }

  /**
   * The user has made changes to the title; call the provided callback.
   */
  handleChangeTitle = (event) => {
    this.props.onChangeConversationTitle(event.target.value);
  }

  /**
   * onEnter within the title editor, call the provided Save callback.
   */
  handleKeyDown = (event) => {
    if (event.keyCode === ENTER && this.props.editingTitle) {
      event.preventDefault();
      this.props.onSaveConversationTitle();
    }
  }

  /**
   * On Canceling editing the title, call the provided cancel callback.
   */
  handleCancel = () => {
    this.props.onCancelEditConversationTitle();
  }

  /**
   * Render an editable title
   */
  renderEditing() {
    const { activeConversation, editingTitle, title } = this.props;
    return (
      <div className='conversation-header panel-header'>
        <div className='title edit-title'>
          <input
            defaultValue={activeConversation ? activeConversation.metadata.title : ''}
            placeholder='Conversation title...'
            onKeyDown={this.handleKeyDown}
            onChange={this.handleChangeTitle}/>
          {editingTitle && <button onClick={this.handleCancel}>Cancel</button>}
        </div>
      </div>
    );
  }

  /**
   * Render a title with an button for changing to edit mode
   */
  renderTitle() {
    const { activeConversation, disableEdit } = this.props;
    var title = '← Create a new conversation or select a conversation from the list.';
    if (activeConversation) {
      if (activeConversation.metadata.title) {
        title = activeConversation.metadata.title;
      } else {
        title = activeConversation.participants
        .map(user => user.displayName)
        .join(', ');
      }
    }

    return (
      <div className='conversation-header panel-header'>
        <div className='title'>
          {title + ' '}
          {!disableEdit && // Hide the pencil icon if disableEdit is true (Used in the DefaultPanel).
            <a href='#' className='edit-title-icon' title='Edit conversation title' onClick={this.handleEditTitle}>
              <i className="fa fa-pencil"></i>
            </a>}
        </div>
      </div>
    );
  }

  render() {
    const { editingNewConversation, editingTitle } = this.props;

    // Show the title input on the NewConversation page or after clicking the pencil icon.
    if (editingNewConversation || editingTitle) {
      return this.renderEditing();
    }
    // Otherwise show the title.
    else {
      return this.renderTitle();
    }
  }
}
