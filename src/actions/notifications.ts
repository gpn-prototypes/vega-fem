import { Notification } from '../types/Notification';

export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const FLUSH_NOTIFICATIONS = 'FLUSH_NOTIFICATIONS';

export type SetNotification = {
  type: string;
  notification: Notification;
};

export type DeleteNotification = {
  type: string;
  index: number;
};

type FlushNotifications = {
  type: string;
};

export type NotificationActions = SetNotification | DeleteNotification | FlushNotifications;

export const setNotification = (notification: Notification): SetNotification => ({
  type: SET_NOTIFICATION,
  notification,
});

export const deleteNotification = (index: number): DeleteNotification => ({
  type: DELETE_NOTIFICATION,
  index,
});

export const flushNotifications = (): FlushNotifications => ({
  type: FLUSH_NOTIFICATIONS,
});
