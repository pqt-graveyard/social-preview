import { createContext, ReactElement } from 'react';

type DefaultNotificationContextValues = {
  notifications: ReactElement[];
};

export const defaultValue: DefaultNotificationContextValues = {
  notifications: [],
};

export const NotificationContext = createContext(defaultValue);
