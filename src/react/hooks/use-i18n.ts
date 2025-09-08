'use client';

import { useMemo } from 'react';
import { t as baseT } from '../../i18n';
import { useLocale } from '../../stores/prepr-store';

export function useTranslations() {
  const locale = useLocale();

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, string | number>) =>
      baseT(key, vars);
  }, [locale]);

  return { t, locale };
}
