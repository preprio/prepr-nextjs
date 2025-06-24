import React from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import { cn } from '../../utils';

interface RadioOption {
  value: string | boolean;
  label: string;
  width?: string;
}

interface RadioSelectorProps {
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  options: RadioOption[];
}

export default function RadioSelector({
  value,
  onChange,
  options,
}: RadioSelectorProps) {
  return (
    <RadioGroup
      className="p-flex p-h-10 p-items-center p-gap-1 p-rounded-lg p-border p-border-gray-300 p-bg-white p-p-1"
      value={value}
      onChange={onChange}
    >
      {options.map(option => (
        <Radio
          key={String(option.value)}
          value={option.value}
          className={cn(
            option.width || 'p-w-[58px]',
            'p-regular-text p-flex p-h-8 p-cursor-pointer p-items-center p-justify-center p-rounded-md p-px-4.5 p-py-2 p-text-center p-text-gray-900 p-transition-all p-duration-200 p-ease-in-out',
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
      ))}
    </RadioGroup>
  );
}
