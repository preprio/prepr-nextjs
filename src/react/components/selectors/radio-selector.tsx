import React from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import { cn } from '../../../utils';
import Tooltip from '../ui/tooltip';

interface RadioOption {
  value: string | boolean;
  label: string;
  width?: string;
  title?: string;
}

interface RadioSelectorProps {
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  options: RadioOption[];
  disabled?: boolean;
}

export default function RadioSelector({
  value,
  onChange,
  options,
  disabled = false,
}: RadioSelectorProps) {
  return (
    <RadioGroup
      className={cn(
        'p-flex p-h-10 p-items-center p-gap-1 p-rounded-lg p-border p-border-gray-300 p-bg-white p-p-1',
        disabled && 'p-cursor-not-allowed p-opacity-50'
      )}
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      {options.map(option => {
        const radio = (
          <Radio
            key={String(option.value)}
            value={option.value}
            className={cn(
              option.width,
              'p-regular-text p-flex p-h-8 p-cursor-pointer p-items-center p-justify-center p-whitespace-nowrap p-rounded-md p-px-4.5 p-py-2 p-text-center p-text-gray-900 p-transition-all p-duration-200 p-ease-in-out',
              disabled && 'p-pointer-events-none',
              option.value === false ||
                option.value === 'null' ||
                option.value === 'off'
                ? 'data-[checked]:p-bg-gray-800 data-[checked]:p-text-white'
                : 'data-[checked]:p-bg-indigo-600 data-[checked]:p-text-white',
              option.value === value && 'p-drop-shadow-3'
            )}
          >
            {option.label}
          </Radio>
        );

        return option.title ? (
          <Tooltip
            key={String(option.value)}
            content={option.title}
            wrapperClassName={option.width}
          >
            {radio}
          </Tooltip>
        ) : (
          radio
        );
      })}
    </RadioGroup>
  );
}
