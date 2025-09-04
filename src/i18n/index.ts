import en from './locales/en.json';
import nl from './locales/nl.json';
import { usePreprStore } from '../stores/prepr-store';

export type Locale = 'en' | 'nl';

const dictionaries: Record<Locale, Record<string, any>> = {
  en: en as Record<string, any>,
  nl: nl as Record<string, any>,
};

function getDict(locale: string) {
  if (locale in dictionaries) return dictionaries[locale as Locale];
  return dictionaries.en;
}

function getFromPath(obj: any, path: string) {
  return path.split('.').reduce((acc: any, key: string) => (acc ? acc[key] : undefined), obj);
}

function format(message: string, vars?: Record<string, string | number>) {
  if (!vars) return message;
  return Object.keys(vars).reduce(
    (acc, k) => acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(vars[k])),
    message
  );
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const { locale } = usePreprStore.getState();
  const dict = getDict(locale);
  const msg = getFromPath(dict, key);
  if (typeof msg === 'string') return format(msg, vars);
  // Fallback to key if not found
  return key;
}

