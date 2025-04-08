const dictionaries = {
  en: () => import('@/data/dictionaries/en.json').then(module => module.default),
  ind: () => import('@/data/dictionaries/id.json').then(module => module.default)
}

export const getDictionary = async (locale: keyof typeof dictionaries) => dictionaries[locale]();

