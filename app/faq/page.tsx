"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const faqs = [
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
    answer: "We accept PayPal, GCash, and major credit cards via Fiverr.",
  },
  {
    question: "Can I customize my order?",
    answer: "Yes! We offer custom requests depending on availability.",
  },
  {
    question: "Where can I contact support?",
    answer: "You can message us directly via Discord or our Fiverr inbox.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-[#d8742c] text-[#1B1B1B] font-[PixterDisplay] relative">
      <Navigation />

      <section className="pt-32 px-6 md:px-24 lg:px-48">
        <h1 className="text-center text-3xl md:text-4xl font-bold text-[#77dd76] mb-12 drop-shadow-lg">
          Frequently Asked Questions
        </h1>

        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
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
      </section>
    </main>
  );
}
