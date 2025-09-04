import React from 'react';
import { PreprSegment } from '../../../types';
import { useSegments, useSelectedSegment, usePreprStore, usePreviewMode } from '../../../stores/prepr-store';
import { usePathname, useRouter } from 'next/navigation';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import SortDown from '../icons/sort-down';
import { cn } from '../../../utils';
import { useTranslations } from '../../hooks/use-i18n';

export default function SegmentSelector() {
  const segments = useSegments();
  const selectedSegment = useSelectedSegment();
  const setSelectedSegment = usePreprStore(state => state.setSelectedSegment);
  const previewMode = usePreviewMode();
  const { t } = useTranslations();

  const pathname = usePathname();
  const router = useRouter();

  const updateSelectedSegment = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    const segment = segments.find(segment => segment._id === value);

    if (segment) {
      setSelectedSegment(segment);
      params.set('prepr_preview_segment', value);

      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
      router.refresh();
    }
  };

  return (
    <Listbox value={selectedSegment._id} onChange={(value: string) => updateSelectedSegment(value)}>
      <ListboxButton
        as="button"
        disabled={!(segments && segments.length > 0) || !previewMode}
        className="p-regular-text p-flex p-h-10 p-w-[240px] p-shrink-0 p-flex-nowrap p-items-center p-gap-2 p-overflow-hidden p-text-ellipsis p-text-nowrap p-rounded-lg p-border p-border-gray-300 p-bg-white p-px-2 p-text-gray-500 disabled:p-cursor-not-allowed disabled:p-bg-gray-200 disabled:p-text-gray-400 data-[open]:p-rounded-b-none data-[open]:p-border-b-white md:p-px-4"
      >
        <div
          style={{
            textWrap: 'nowrap',
            textOverflow: 'ellipsis',
            textAlign: 'left',
          }}
          className="p-mr-auto p-w-full p-overflow-hidden"
        >
          {segments.length > 0
            ? selectedSegment._id === 'null'
              ? t('segments.choose')
              : selectedSegment.name
            : t('segments.none')}
        </div>
        <div className="p-text-gray-800">
          <SortDown />
        </div>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom start"
        className="p-no-scrollbar p-z-[9999] !p-max-h-[300px] p-w-[240px] p-rounded-b-md p-border-x p-border-b p-border-gray-300 p-bg-white p-shadow-xl"
      >
        {segments?.map((segment: PreprSegment) => (
          <ListboxOption
            key={segment._id}
            value={segment._id}
            className={cn(
              'p-regular-text p-z-[100] p-flex p-w-full p-items-center p-p-2 p-px-4 hover:p-cursor-pointer',
              segment._id === selectedSegment._id
                ? 'p-bg-indigo-50 p-text-indigo-700'
                : 'p-bg-white p-text-gray-900 hover:p-bg-gray-100'
            )}
          >
            <div
              style={{
                textWrap: 'nowrap',
                textOverflow: 'ellipsis',
                textAlign: 'left',
              }}
              className="p-mr-auto p-w-full p-overflow-hidden"
            >
              {segment.name}
            </div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
