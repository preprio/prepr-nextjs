'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { handleContextError } from '../../utils/errors';

interface EditModeContextValue {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  isIframe: boolean;
}

const EditModeContext = createContext<EditModeContextValue | undefined>(
  undefined
);

interface EditModeProviderProps {
  children: ReactNode;
}

export function EditModeProvider({ children }: EditModeProviderProps) {
  const [editMode, setEditMode] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    if (window.parent !== self) {
      setIsIframe(true);
    }
  }, []);

  // Handle escape key to turn off edit mode
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && editMode) {
        setEditMode(false);
      }
    };

    if (editMode) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [editMode]);

  const value: EditModeContextValue = {
    editMode,
    setEditMode,
    isIframe,
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditModeContext(): EditModeContextValue {
  const context = useContext(EditModeContext);
  if (!context) {
    handleContextError('useEditModeContext');
  }
  return context!;
}
