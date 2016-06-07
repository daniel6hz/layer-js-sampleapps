# React chat UI example using Layer SDK

This is a simple example on how one would use the Layer Web SDK with the [ReactJS](https://reactjs.org) framework.

It depends on [layer-react](https://github.com/layerhq/layer-react) library which provides an interface to subscribe to both local and remote changes in message and conversation objects.

### Installation

To install all dependencies and build this project use the following command:

    npm install

### Running

To run this project use the following command:

    npm start

Point your browser to: [localhost:8080](http://localhost:8080)

### Architecture

Understanding this application requires understanding two things:

1. [Redux](http://rackt.org/redux/) architecture
2. [layer-react](./layer-react) module

The layer-react module provides a LayerProvider for wrapping UI Components; it takes as input a Client, and passes to its children the output of Conversation and Message queries.
