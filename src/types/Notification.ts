export type NotificationStatus = 'alert' | 'normal' | 'system' | 'success' | 'warning' | undefined;

export type Notification = {
  message: string;
  status?: NotificationStatus;
  autoClose?: boolean;
  icon?: React.FC<any>;
};

export type NotificationState = {
  list: Notification[];
};
