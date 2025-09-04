'use client';

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { PreprSegment } from '../types';
import { sendPreprEvent } from '../utils';

interface PreprStore {
  // Locale slice
  locale: string;
  setLocale: (locale: string) => void;

  // Segment slice
  segments: PreprSegment[];
  selectedSegment: PreprSegment;
  emptySegment: PreprSegment;
  setSelectedSegment: (segment: PreprSegment) => void;
  initializeSegments: (
    segments: readonly PreprSegment[],
    activeSegment?: string | null
  ) => void;

  // Variant slice
  selectedVariant: string | null;
  emptyVariant: string;
  setSelectedVariant: (variant: string | null) => void;
  initializeVariant: (activeVariant?: string | null) => void;

  // Edit mode slice
  editMode: boolean;
  isIframe: boolean;
  setEditMode: (mode: boolean) => void;
  setIsIframe: (isIframe: boolean) => void;

  // Preview mode slice
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;

  // Toolbar visibility slice
  toolbarOpen: boolean;
  setToolbarOpen: (open: boolean) => void;

  // Reset actions
  resetPersonalization: () => void;
  resetAll: () => void;

  // Store initialization
  initialize: (props: {
    initialSegments: readonly PreprSegment[];
    activeSegment?: string | null;
    activeVariant?: string | null;
  }) => void;
}

export const usePreprStore = create<PreprStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial i18n state
    locale: 'en',
    setLocale: (locale: string) => set({ locale }),

    // Initial segment state
    segments: [],
    selectedSegment: {
      name: 'Choose segment',
      _id: 'null',
    },
    emptySegment: {
      name: 'Choose segment',
      _id: 'null',
    },
    setSelectedSegment: (segment: PreprSegment) => {
      set({ selectedSegment: segment });
      sendPreprEvent('segment_changed', { segment: segment._id });
    },
    initializeSegments: (
      initialSegments: readonly PreprSegment[],
      activeSegment?: string | null
    ) => {
      const segmentList: PreprSegment[] = [
        {
          _id: 'all_other_users',
          name: 'All other users',
        },
        ...initialSegments,
      ];

      const emptySegment: PreprSegment = {
        name: 'Choose segment',
        _id: 'null',
      };

      const selectedSegment =
        (segmentList &&
          segmentList.filter(
            (segmentData: PreprSegment) => segmentData._id === activeSegment
          )[0]) ||
        emptySegment;

      set({
        segments: segmentList,
        selectedSegment,
        emptySegment,
      });
    },

    // Initial variant state
    selectedVariant: 'A',
    emptyVariant: 'A',
    setSelectedVariant: (variant: string | null) => {
      set({ selectedVariant: variant });
      sendPreprEvent('variant_changed', { variant: variant ?? undefined });
    },
    initializeVariant: (activeVariant?: string | null) => {
      set({ selectedVariant: activeVariant || 'A' });
    },

    // Initial edit mode state
    editMode: false,
    isIframe: false,
    setEditMode: (mode: boolean) => {
      set({ editMode: mode });
      sendPreprEvent('edit_mode_toggled', { editMode: mode });
    },
    setIsIframe: (isIframe: boolean) => {
      set({ isIframe });
    },

    // Initial preview mode state
    previewMode: true,
    setPreviewMode: (mode: boolean) => {
      set({ previewMode: mode });
      // Ensure edit mode is off when toolbar is disabled
      if (!mode) {
        const { setEditMode } = get();
        setEditMode(false);
      }
      // Manage toolbar open state and cookie to restore after reload
      const { setToolbarOpen } = get();
      // Auto-close toolbar when toggling preview mode
      setToolbarOpen(false);
      // Cookie handling
      if (typeof document !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `Prepr-Preview-Mode=${mode.toString()};expires=${expires.toUTCString()};path=/`;
        document.cookie = `Prepr-Toolbar-Open=false;expires=${expires.toUTCString()};path=/`;
      }
      sendPreprEvent('preview_mode_toggled', { previewMode: mode });
      // Refresh the page to apply the new preview mode state
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },

    // Toolbar visibility
    toolbarOpen: false,
    setToolbarOpen: (open: boolean) => {
      set({ toolbarOpen: open });
      if (typeof document !== 'undefined') {
        const expires = new Date();
        expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = `Prepr-Toolbar-Open=${open.toString()};expires=${expires.toUTCString()};path=/`;
      }
    },

    // Reset actions
    resetPersonalization: () => {
      const {
        emptySegment,
        emptyVariant,
        setSelectedSegment,
        setSelectedVariant,
      } = get();
      setSelectedSegment(emptySegment);
      setSelectedVariant(emptyVariant);
    },
    resetAll: () => {
      const {
        emptySegment,
        emptyVariant,
        setSelectedSegment,
        setSelectedVariant,
        setEditMode,
      } = get();
      setSelectedSegment(emptySegment);
      setSelectedVariant(emptyVariant);
      setEditMode(false);
    },

    // Master initialization
    initialize: props => {
      const { initializeSegments, initializeVariant } = get();
      initializeSegments(props.initialSegments, props.activeSegment);
      initializeVariant(props.activeVariant);
    },
  }))
);

// Selectors for performance optimization
export const useSegments = () => usePreprStore(state => state.segments);
export const useSelectedSegment = () =>
  usePreprStore(state => state.selectedSegment);
export const useSelectedVariant = () =>
  usePreprStore(state => state.selectedVariant);
export const useEditMode = () => usePreprStore(state => state.editMode);
export const useIsIframe = () => usePreprStore(state => state.isIframe);
export const usePreviewMode = () => usePreprStore(state => state.previewMode);
export const useLocale = () => usePreprStore(state => state.locale);
