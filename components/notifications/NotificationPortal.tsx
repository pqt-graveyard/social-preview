import { ComponentHTMLProps } from '@pqt/react-components/dist/types';
import { ReactPortal } from 'react';
import { createPortal } from 'react-dom';

type NotificationPortalProps = ComponentHTMLProps;

export const NotificationPortal = ({ children }: NotificationPortalProps): ReactPortal | null => {
  return typeof document !== 'undefined' ? createPortal(children, document.body) : null;
};
