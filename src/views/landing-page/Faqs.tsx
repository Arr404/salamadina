import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe } from 'lucide-react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '@/services/init';
import { FAQ, LanguageOption } from '@/types/faqs';

// Initialize Firebase
const db = getFirestore(app);

const Faqs: React.FC = () => {
  const [faqsData, setFaqsData] = useState<FAQ[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string>('');
  const [language, setLanguage] = useState<string>('en'); // Default language
  const [allCategories, setAllCategories] = useState<string[]>(['all']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch FAQ data from Firestore
  useEffect(() => {
    async function fetchFaqsData() {
      try {
        setIsLoading(true);
        const faqsCollection = collection(db, 'faq');
        const faqsSnapshot = await getDocs(faqsCollection);

        const faqsList = faqsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as FAQ;
        });

        // Set expanded ID to first item if none is set
        if (faqsList.length > 0 && !expandedId) {
          setExpandedId(faqsList[0].id);
        }

        setFaqsData(faqsList);

        // Extract all unique categories
        const categories = ['all', ...new Set(faqsList.flatMap((faq) => faq.categories))].sort();
        setAllCategories(categories);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setIsLoading(false);
      }
    }

    fetchFaqsData();
  }, [expandedId]);

  const filteredFaqs = faqsData.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.categories.includes(activeCategory);

    // Check if the current language exists in translations
    const faqTranslation = faq.translations && faq.translations[language];
    if (!faqTranslation) return false;

    const matchesSearch =
      faqTranslation.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faqTranslation.answer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Language toggle options
  const languageOptions: LanguageOption[] = [
    { code: 'en', label: 'English' },
    { code: 'ind', label: 'Bahasa Indonesia' },
  ];

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold bg-[#811745] text-white rounded-xl">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            {language === 'en' ? 'Frequently asked' : 'Pertanyaan yang sering'}{' '}
            <span className="relative">
              <span className="relative">{language === 'en' ? 'questions' : 'ditanyakan'}</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-pink-100 -z-10 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            {language === 'en'
              ? 'Browse through these FAQs to find answers to commonly asked questions.'
              : 'Jelajahi FAQ ini untuk menemukan jawaban atas pertanyaan yang sering diajukan.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column with Image and Filters */}
          <div className="lg:col-span-5">
            <div className="relative">
              {/* Language Selector */}
              <div className="flex items-center justify-start mb-6">
                <Globe className="h-5 w-5 text-gray-500 mr-2" />
                <div className="flex space-x-2">
                  {languageOptions.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => setLanguage(option.code)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        language === option.code
                          ? 'bg-[#811745] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#811745] focus:border-[#811745] sm:text-sm"
                    placeholder={language === 'en' ? 'Search FAQs...' : 'Cari FAQ...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mt-6">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                      activeCategory === category
                        ? 'bg-[#811745] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="md:block hidden aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden mt-8">
                <img
                  src="/images/landing/umrah.jpg"
                  alt="Umrah Services"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column with FAQs */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#811745]"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-lg shadow-sm border border-gray-100"
                    >
                      <button
                        onClick={() => setExpandedId(expandedId === faq.id ? '' : faq.id)}
                        className="w-full text-left px-6 py-4 focus:outline-none relative"
                      >
                        <div className="pr-8">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {faq.translations[language]?.question}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {faq.categories.map((category) => (
                              <span
                                key={category}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-[#811745]"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span
                          className={`absolute right-6 top-6 transform transition-transform ${
                            expandedId === faq.id ? 'rotate-180' : ''
                          }`}
                        >
                          ▼
                        </span>
                      </button>
                      <AnimatePresence>
                        {expandedId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-4"
                          >
                            {/* Updated answer text to render \n as line breaks */}
                            <p className="text-gray-600 whitespace-pre-line">
                              {faq.translations[language]?.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {filteredFaqs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500"
                  >
                    {language === 'en'
                      ? 'No FAQs found matching your criteria.'
                      : 'Tidak ada FAQ yang cocok dengan kriteria Anda.'}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
