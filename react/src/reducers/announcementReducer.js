import {
  SHOW_ANNOUNCEMENTS,
  HIDE_ANNOUNCEMENTS,
} from '../actions/messenger';

const initialState = {
  showAnnouncements: false,
};

export default function announcementsReducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SHOW_ANNOUNCEMENTS:
      return {
        ...state,
        showAnnouncements: true,
      };
    case HIDE_ANNOUNCEMENTS:
      return {
        ...state,
        showAnnouncements: false,
      };
    default:
      return state;
  }
}
