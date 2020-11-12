type ErrorMessageType = {
  [key: number]: string;
};

export const errorMessages: ErrorMessageType = {
  404: 'Make sure you entered the correct details. The repository must also be public.',
};

/**
 *
 * @param name the name of the parameter that is causing the error
 * @param acceptableParameters An array of strings that can be used to help guide the read to understanding what valid values will be accepted
 * @param defaultParameter An optional default parameter that will be used if nothing is provided to this parameter
 */
export const generateQueryParameterErrorMessage = (
  name: string,
  acceptableParameters?: string[],
  defaultParameter?: string
) => {
  const [baseMessage, acceptableParameterMessage, defaultParameterMessage] = [
    `Query Parameter [${name}] is invalid.`,
    typeof acceptableParameters !== 'undefined' &&
      `If defined it must be one of: ${[...acceptableParameters].join(', ')}.`,
    typeof defaultParameter !== 'undefined' && `(default: ${defaultParameter})`,
  ];

  return [baseMessage, acceptableParameterMessage, defaultParameterMessage].filter(Boolean).join(' ');
};
