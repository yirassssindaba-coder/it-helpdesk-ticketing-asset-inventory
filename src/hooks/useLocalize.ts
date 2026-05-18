import { useLanguage } from '../contexts/LanguageContext';
import {
  DIVISION_NAMES,
  PERSON_NAMES,
  TICKET_TITLES,
  LOCATION_NAMES,
  localizeValue,
} from '../i18n/masterData';

export function useLocalize() {
  const { language } = useLanguage();

  return {
    localizeDiv: (value: string) => localizeValue(value, DIVISION_NAMES, language),
    localizeName: (value: string) => localizeValue(value, PERSON_NAMES, language),
    localizeTitle: (value: string) => localizeValue(value, TICKET_TITLES, language),
    localizeLocation: (value: string) => localizeValue(value, LOCATION_NAMES, language),
  };
}
