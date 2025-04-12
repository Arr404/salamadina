import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const FaqsData = [
  {
    id: 'panel1',
    categories: ['packages', 'pricing', 'services'],
    question: 'What is included in your Hajj and Umrah packages?',
    answer: 'Our packages typically include flights, accommodation near Haram, transportation, visa processing, guided tours, and meals. Specific inclusions may vary by package, so please check the details for your selected plan.'
  },
  {
    id: 'panel2',
    categories: ['visa', 'documentation', 'requirements'],
    question: 'Do I need a visa for Hajj or Umrah?',
    active: true,
    answer: 'Yes, a visa is required for both Hajj and Umrah. We assist in obtaining the necessary visa as part of our service. Requirements include a valid passport, vaccination certificates, and other necessary documents.'
  },
  {
    id: 'panel3',
    categories: ['accommodation', 'packages', 'services'],
    question: 'What are the accommodation options during Hajj and Umrah?',
    answer: 'We offer a range of accommodations from budget-friendly to premium hotels near Masjid al-Haram in Makkah and Masjid an-Nabawi in Madinah. Our packages specify the hotels included, ensuring comfort and convenience.'
  },
  {
    id: 'panel4',
    categories: ['timing', 'planning', 'services'],
    question: 'What is the best time to perform Umrah?',
    answer: 'Umrah can be performed year-round, but many prefer to travel during Ramadan for its spiritual rewards. Off-peak seasons (outside Ramadan and Hajj) offer a less crowded experience and lower costs.'
  }
];

const allCategories = ['all', ...new Set(FaqsData.flatMap(faq => faq.categories))].sort();

const Faqs = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState('panel2');

  const filteredFaqs = FaqsData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.categories.includes(activeCategory);
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id='faq' className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 mb-4 text-sm font-semibold bg-[#811745] text-white rounded-xl">
            FAQ
          </span>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Frequently asked{' '}
            <span className="relative">
              <span className="relative ">questions</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-pink-100 -z-10 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            Browse through these FAQs to find answers to commonly asked questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column with Image */}
          <div className="lg:col-span-5">
            <div className="relative">

              {/* Search Bar */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#811745] focus:border-[#811745] sm:text-sm"
                    placeholder="Search FAQs..."
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
              <div className="md:block hidden aspect-w-4 aspect-h-5 rounded-2xl overflow-hidden">
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
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
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
                      <span className={`absolute right-6 top-6 transform transition-transform ${
                        expandedId === faq.id ? 'rotate-180' : ''
                      }`}>
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
                          <p className="text-gray-600">{faq.answer}</p>
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
                  No FAQs found matching your criteria.
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
