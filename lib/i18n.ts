import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

AsyncStorage.getItem('language').then((lang) => {
  if (lang === 'en' || lang === 'es') i18n.changeLanguage(lang);
});

export async function setLanguage(lang: 'en' | 'es') {
  await AsyncStorage.setItem('language', lang);
  i18n.changeLanguage(lang);
}

export default i18n;
