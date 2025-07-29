'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { handleContextError } from '../../utils/errors';
import { sendPreprEvent } from '../../utils';

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

  const handleSetSelectedVariant = (variant: string | null) => {
    setSelectedVariant(variant);
    sendPreprEvent('variant_changed', { variant: variant ?? undefined });
  };

  const value: VariantContextValue = {
    selectedVariant,
    setSelectedVariant: handleSetSelectedVariant,
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
