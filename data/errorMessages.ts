type ErrorMessageType = {
  [key: number]: string;
};

export const errorMessages: ErrorMessageType = {
  404: 'Make sure you entered the correct details. The repository must also be public.',
};
