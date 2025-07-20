// lib/dictionary.js
// import 'server-only' // Opsional: Pastikan ini hanya di server (untuk App Router)

const dictionaries = {
  en: () => import('../locales/en.json').then((module) => module.default),
  id: () => import('../locales/id.json').then((module) => module.default),
};

export const getDictionary = async (locale) => dictionaries[locale]();
