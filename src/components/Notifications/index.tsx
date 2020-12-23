import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Item } from '@consta/uikit/SnackBar';
import { SnackBar } from '@gpn-prototypes/vega-ui';

import { cnNotifications } from './cn-notifications';

import './index.css';

import { deleteNotification } from '@/actions/notifications';
import { RootState } from '@/reducers/rootReducer';
import { Notification } from '@/types/Notification';

export const Notifications = (): React.ReactElement => {
  const dispatch = useDispatch();

  const notifications = useSelector<RootState, Notification[]>(
    (state) => state.notificationsReducer.list,
  );

  const items = notifications.map(
    (notification, index) =>
      ({
        key: index,
        message: notification.message,
        status: notification.status,
        icon: notification.icon,
        onClose: () => {
          dispatch(deleteNotification(index));
        },
      } as Item),
  );

  return (
    <div className={cnNotifications()}>
      <SnackBar className={cnNotifications('SnackBar')} items={items} />
    </div>
  );
};
