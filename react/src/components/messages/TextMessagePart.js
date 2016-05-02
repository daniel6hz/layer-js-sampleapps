import React, { Component } from 'react';

export default class TextMessagePart extends Component {
  render() {
    return <div className='bubble text'>{this.props.messagePart.body}</div>;
  }
}
