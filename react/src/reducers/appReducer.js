import {
  CLIENT_READY,
  FETCH_USERS_SUCCESS
} from '../actions/messenger';

const initialState = {
  ready: false,
  clientReady: false,
};

export default function appReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case CLIENT_READY:
      return {
        ...state,
        ready: true,
        clientReady: true
      };

    default:
      return state;
  }
}
