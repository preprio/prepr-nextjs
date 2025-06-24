import React from 'react';
import { cn } from '../../../utils';
import Icon from '../icon';

interface PreviewBarButtonProps {
  onClick: () => void;
  className?: string;
}

export function PreviewBarButton({
  onClick,
  className,
}: PreviewBarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'cursor-pointer p-z-50 p-flex p-size-9 p-items-center p-justify-center p-rounded-full p-bg-primary-700',
        className
      )}
    >
      <Icon className="p-text-white" />
    </button>
  );
}
