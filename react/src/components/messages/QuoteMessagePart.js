import React, { Component } from 'react';

export default class QuoteMessagePart extends Component {
  render() {
    return <div className='bubble quote'>{this.props.messagePart.body}</div>;
  }
}
