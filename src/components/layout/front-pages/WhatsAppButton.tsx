import React, { useState } from 'react';
import { MessageCircle, X, Phone, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const contacts = [
    {
      name: "Customer Service 1",
      role: "Sales Representative",
      phone: "+6281234567890",
      availability: "08:00 - 17:00 WIB"
    },
    {
      name: "Customer Service 2",
      role: "Travel Consultant",
      phone: "+6281234567891",
      availability: "10:00 - 19:00 WIB"
    },
    {
      name: "Support Team",
      role: "Technical Support",
      phone: "+6281234567892",
      availability: "24/7 Support"
    }
  ];

  const handleWhatsAppClick = (phone:string) => {
    window.open(`https://wa.me/${phone}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-16 right-0 mb-4 bg-white rounded-lg shadow-xl w-72 overflow-hidden"
          >
            <div className="p-4 bg-green-500 text-white">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Contact Us</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-green-600 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm opacity-90">Select a representative to chat with</p>
            </div>
            <div className="divide-y divide-gray-100">
              {contacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleWhatsAppClick(contact.phone)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <UserCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-600">{contact.role}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Phone size={14} />
                        <span>{contact.phone}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{contact.availability}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-green-500 text-white rounded-full p-4 shadow-lg flex items-center gap-2 hover:bg-green-600 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="font-medium">Chat with Us</span>
      </motion.button>
    </div>
  );
};

export default WhatsAppButton;
