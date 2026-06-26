import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { en, es } from '@/data/translations';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

function getLanguageStorage() {
  if (typeof window === 'undefined') return null;

  if (Platform.OS === 'web') {
    return {
      getItem: async (key: string) => window.localStorage.getItem(key),
      setItem: async (key: string, value: string) => {
        window.localStorage.setItem(key, value);
      },
    };
  }

  return AsyncStorage;
}

const languageStorage = getLanguageStorage();

if (languageStorage) {
  languageStorage.getItem('language').then((lang) => {
    if (lang === 'en' || lang === 'es') i18n.changeLanguage(lang);
  });
}

export async function setLanguage(lang: 'en' | 'es') {
  const storage = getLanguageStorage();
  if (storage) await storage.setItem('language', lang);
  i18n.changeLanguage(lang);
}

export default i18n;
