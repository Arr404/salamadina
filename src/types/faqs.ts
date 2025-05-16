export interface Translation {
  question: string;
  answer: string;
}

export interface Translations {
  [key: string]: Translation;
}

export interface FAQ {
  id: string;
  categories: string[];
  translations: Translations;
}

export interface LanguageOption {
  code: string;
  label: string;
}
