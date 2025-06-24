import React from 'react';
// import classNames from 'classnames';
// import { FaRotate } from 'react-icons/fa6';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../../utils';
import { usePreprPreviewBar } from '../prepr-previewbar-provider';
import Rotate from './icons/rotate';

export default function ResetButton() {
  const router = useRouter();
  const { resetAll, selectedVariant, selectedSegment, setEditMode, editMode } =
    usePreprPreviewBar();
  const pathname = usePathname();
  const enabled =
    selectedSegment._id !== 'null' || selectedVariant !== 'null' || editMode;

  const handleClick = () => {
    resetAll();

    // Push null values to the URL to reset the preview
    const params = new URLSearchParams({});
    params.append('prepr_preview_segment', 'null');
    params.append('prepr_preview_ab', 'null');

    setEditMode(false);

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
    router.refresh();

    // Remove the params from the URL
    params.delete('prepr_preview_segment');
    params.delete('prepr_preview_ab');
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
    router.refresh();
  };

  const classes = cn(
    'p-py-2 p-px-3 p-flex p-justify-center p-gap-2 p-items-center p-rounded-md p-regular-text p-h-10 p-w-full md:p-w-[108px]',
    enabled &&
      'p-bg-secondary-400 hover:p-secondary-500 p-cursor-pointer p-text-white',
    !enabled && 'p-bg-grey-400 p-text-gray-500'
  );

  return (
    <button onClick={handleClick} className={classes} disabled={!enabled}>
      <Rotate />
      <span className="p-block sm:p-hidden lg:p-block">Reset</span>
    </button>
  );
}
