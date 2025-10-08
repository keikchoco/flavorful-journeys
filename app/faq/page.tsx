"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";

type FAQ = {
  question: string;
  answer: string;
};

// Fallback FAQs in case database is not available
const fallbackFaqs: FAQ[] = [
  {
    question: "Where can I create my account?",
    answer: "You can create your account when you download the game!",
  },
  {
    question: "Where can I place my order?",
    answer: "You can place your order through our Discord server or Fiverr gig!",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept PayPal for payments.",
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>(fallbackFaqs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/faqs');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.faqs.length > 0) {
        setFaqs(result.faqs);
      } else {
        // Keep fallback FAQs if no data from database
        console.log('No FAQs found in database, using fallback FAQs');
      }
    } catch (error) {
      console.error('FAQ loading error:', error);
      setError('Failed to load FAQs from database, showing default FAQs');
      // Keep fallback FAQs on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#d8742c] text-[#1B1B1B] font-[PixterDisplay] relative">
      <Navigation />

      <section className="pt-32 px-6 md:px-24 lg:px-48">
        <h1 className="text-center text-3xl md:text-4xl font-bold text-[#77dd76] mb-12 drop-shadow-lg">
          Frequently Asked Questions
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6 text-center">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#77dd76] mx-auto mb-4"></div>
            <p className="text-xl text-[#77dd76]">Loading FAQs...</p>
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-[#77dd76] mb-4">No FAQs available at the moment.</p>
            <button
              onClick={loadFaqs}
              className="bg-[#77dd76] hover:bg-[#4ca54b] text-[#1B1B1B] px-6 py-2 rounded font-semibold"
            >
              Refresh
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {faqs.map((item: FAQ, i: number) => (
            <motion.div
              key={i}
              className="bg-[#f7f4f0] rounded-xl shadow-lg p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between items-center w-full text-left"
              >
                <p className="font-bold text-lg">{item.question}</p>
                <motion.div
                  animate={{ rotate: openIndex === i ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[#1b1b1b]"
                >
                  <ChevronRight size={30} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-base md:text-lg pl-3 text-[#1b1b1b]/80">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
          </div>
        )}
      </section>
    </main>
  );
}
