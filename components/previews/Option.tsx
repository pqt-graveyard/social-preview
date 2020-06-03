import React from 'react';
import { ComponentHTMLProps } from '../types';
import classNames from 'classnames';

export type OptionProps = ComponentHTMLProps & {
  alt?: string;
  selected?: boolean;
  src: string;
};

export const Option: React.FC<OptionProps> = ({ alt, src, selected = false, ...rest }: OptionProps) => {
  return (
    <div
      className={classNames([
        'shadow-sm',
        'hover:shadow-lg',
        'rounded',
        'border',

        'p-1',
        'md:p-2',
        'lg:p-3',
        'overflow-hidden',
        selected ? ['border-blue-300', 'bg-blue-100'] : ['border-gray-300', 'bg-gray-100'],
      ])}
      {...rest}
    >
      <img src={src} alt={alt} className={classNames(['w-full', 'rounded', 'border', 'bg-gray-300'])} />
    </div>
  );
};
