import {
  CLIENT_READY,
  OWNER_SET
} from '../actions/messenger';

const initialState = {
  ready: false,
  clientReady: false,
  owner: {}
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
    case OWNER_SET:
      return {
        ...state,
        owner: payload.owner,
      };
    default:
      return state;
  }
}
