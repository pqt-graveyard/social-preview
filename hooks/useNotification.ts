type CreateNotificationProps = {
  message: string;
};
const createNotification = ({ message }: CreateNotificationProps): void => {
  alert(message);
};

export const useNotification = () => ({
  createNotification,
});
