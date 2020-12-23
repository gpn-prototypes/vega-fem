import _ from 'lodash';

import { FEM_CLEAR_STORES } from '../actions/clear';
import {
  DELETE_NOTIFICATION,
  DeleteNotification,
  FLUSH_NOTIFICATIONS,
  NotificationActions,
  SET_NOTIFICATION,
  SetNotification,
} from '../actions/notifications';
import { NotificationState } from '../types/Notification';

const initialState: NotificationState = {
  list: [],
};

export default function versionReducer(
  state = initialState,
  action: NotificationActions,
): NotificationState {
  switch (action.type) {
    case SET_NOTIFICATION: {
      const { notification } = action as SetNotification;
      return {
        ...state,
        list: state.list.length
          ? _.uniqWith([...state.list, notification], _.isEqual)
          : [notification],
      };
    }
    case DELETE_NOTIFICATION: {
      const { index } = action as DeleteNotification;
      return {
        ...state,
        list: state.list.filter((value, idx) => idx !== index),
      };
    }
    case FLUSH_NOTIFICATIONS:
    case FEM_CLEAR_STORES:
      return {
        ...state,
        list: [],
      };
    default:
      return state;
  }
}
