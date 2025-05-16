import { useState, useEffect } from 'react';
import { getLanguage } from '@/utils/getLanguage';
import { Testimonial } from '@/types/testimonial';
import { getTestimonials } from '@/services/testimonial';

export const useLocalizedTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [language, setLanguage] = useState<'en' | 'ind' | 'id'>(getLanguage());

  useEffect(() => {
    if(language === 'ind'){
      setLanguage('id');
    }
  }, [language])
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials();
        setTestimonials(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch testimonials'));
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Get the localized description for each testimonial
  const localizedTestimonials = testimonials.map(testimonial => ({
    ...testimonial,
    // Fallback to 'en' if the requested language is not available
    localizedDesc: testimonial.desc[language] || testimonial.desc['en'] || '',
  }));

  return { testimonials: localizedTestimonials, loading, error };
};
