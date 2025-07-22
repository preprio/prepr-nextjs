import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../../../utils';
import { usePreprToolbar } from '../toolbar/toolbar-provider';
import Rotate from '../icons/rotate';

export default function ResetButton() {
  const router = useRouter();
  const { resetAll, selectedVariant, selectedSegment, setEditMode, editMode } =
    usePreprToolbar();
  const pathname = usePathname();
  const enabled =
    selectedSegment._id !== 'null' || selectedVariant !== 'null' || editMode;

  const handleClick = () => {
    resetAll();
    setEditMode(false);

    // Set preview params to 'null' in the URL, then remove them for a clean URL
    const params = new URLSearchParams();
    params.set('prepr_preview_segment', 'null');
    params.set('prepr_preview_ab', 'null');

    // First, push the URL with reset params to trigger any listeners
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    router.refresh();

    // Then, push the clean URL (without the reset params)
    router.push(pathname, { scroll: false });
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
