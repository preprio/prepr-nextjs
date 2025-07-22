'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { handleContextError } from '../../utils/errors';

interface VariantContextValue {
  selectedVariant: string | null;
  setSelectedVariant: (variant: string | null) => void;
  emptyVariant: string;
}

const VariantContext = createContext<VariantContextValue | undefined>(
  undefined
);

interface VariantProviderProps {
  children: ReactNode;
  activeVariant?: string | null;
}

export function VariantProvider({
  children,
  activeVariant,
}: VariantProviderProps) {
  const emptyVariant = 'null';

  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    activeVariant || 'null'
  );

  const value: VariantContextValue = {
    selectedVariant,
    setSelectedVariant,
    emptyVariant,
  };

  return (
    <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
  );
}

export function useVariantContext(): VariantContextValue {
  const context = useContext(VariantContext);
  if (!context) {
    handleContextError('useVariantContext');
  }
  return context!;
}
