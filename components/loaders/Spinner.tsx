import React, { ReactElement } from 'react';
import { ComponentSVGProps } from '../types';

export interface SpinnerProps extends ComponentSVGProps {
  size?: string | number;
  fill?: string;
}

export const Spinner = ({ fill = 'currentColor', size = 40, ...props }: SpinnerProps): ReactElement => {
  return (
    <svg viewBox="0 0 24 24" height={size} width={size} {...props}>
      <path
        fill={fill}
        d="M12 20C18 20 21 15.866 21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 12 3 11 4 11C5 11 5 12 5 12C5 15.866 8.13401 20 12 20Z"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 12 12"
          to="360 12 12"
          dur="0.6s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};
