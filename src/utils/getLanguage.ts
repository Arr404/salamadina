export const getLanguage = (): 'en' | 'ind' => {
  if (typeof window !== 'undefined') {
    const lang = localStorage.getItem('I18N_LANGUAGE') as string | null;
    return lang === 'en' || lang === 'ind' ? lang : 'en'; // Default to 'en'
  }
  return 'en';
};
