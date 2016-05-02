import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Client } from 'layer-sdk';
import { LayerProvider } from 'layer-react';
import Messenger from './containers/Messenger';
import NewConversation from './containers/NewConversation';
import ActiveConversation from './containers/ActiveConversation';
import DefaultPanel from './components/DefaultPanel';
import configureStore from './store/configureStore';
import { fetchUsersSuccess } from './actions/messenger';
import { IndexRoute, Route } from 'react-router';
import { ReduxRouter } from 'redux-router';

/**
 * Wait for identity dialog message to complete
 */
window.addEventListener('message', function(evt) {
  if (evt.data !== 'layer:identity') return;

  /**
   * Initialize Layer Client with `appId`
   */
  const client = new Client({
    appId: window.layerSample.appId
  });

  /**
   * Client authentication challenge.
   * Sign in to Layer sample identity provider service.
   *
   * See http://static.layer.com/sdk/docs/#!/api/layer.Client-event-challenge
   */
  client.once('challenge', e => {
    window.layerSample.challenge(e.nonce, e.callback);
  });

  /**
   * Start authentication
   */
  client.connect(window.layerSample.userId);

  /**
   * Share the client with the middleware layer
   */
  const store = configureStore(client);

  /**
   * Bootstrap users
   */
  store.dispatch(fetchUsersSuccess(window.layerSample.users));

  // Render the UI wrapped in a LayerProvider
  render(
    <LayerProvider client={client}>
      <Provider store={store}>
        <ReduxRouter>
          <Route path='/' component={Messenger}>
            <IndexRoute component={DefaultPanel}/>
            <Route path='/new' component={NewConversation}/>
            <Route path='/conversations/:conversationId' component={ActiveConversation}/>
          </Route>
        </ReduxRouter>
      </Provider>
    </LayerProvider>,
    document.getElementById('root')
  );
});
