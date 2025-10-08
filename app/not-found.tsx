"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import loadingScreen from "@/public/assets/Loading Screen2.png";

export default function NotFoundPage() {
  const { user, isAdmin } = useAuthContext();

  // Determine the appropriate home page based on user status
  const getHomePath = () => {
    if (user && isAdmin) {
      return "/admin/dashboard";
    } else if (user) {
      return "/user/dashboard";
    }
    return "/";
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <main className="min-h-screen text-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={loadingScreen}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <motion.div
        className="bg-[#E5E5E5]/95 backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-[#1B1B1B] text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Logo/Icon */}
        <motion.div 
          className="mb-8"
          animate={pulseAnimation}
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-[#fa9130] to-[#77dd76] rounded-full flex items-center justify-center mb-6 shadow-lg">
            <motion.div
              className="text-6xl"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🍳
            </motion.div>
          </div>
        </motion.div>

        {/* Error Code */}
        <motion.div variants={itemVariants}>
          <h1 className="text-8xl md:text-8xl font-bold text-transparent bg-gradient-to-r from-[#fa9130] to-[#77dd76] bg-clip-text mb-4 font-[PixterDisplay]">
            404
          </h1>
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-[PixterDisplay] text-[#1B1B1B]">
            Oops! Recipe Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            It looks like this ingredient went missing from our kitchen! 
            The page you're looking for might have been moved, deleted, or never existed.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          {/* Primary Action - Go Home */}
          <Link href={getHomePath()}>
            <motion.button
              className="bg-gradient-to-r from-[#fa9130] to-[#ff6b35] hover:from-[#ff6b35] hover:to-[#fa9130] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-[PixterDisplay] text-lg min-w-[200px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🏠 Back to Kitchen
            </motion.button>
          </Link>

          {/* Secondary Action - Previous Page */}
          <motion.button
            onClick={() => window.history.back()}
            className="bg-[#77dd76] hover:bg-[#5cb85c] text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 font-[PixterDisplay] text-lg min-w-[200px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⬅️ Go Back
          </motion.button>
        </motion.div>

        {/* Fun Footer Message */}
        <motion.div 
          className="mt-8 text-sm text-gray-500"
          variants={itemVariants}
        >
          <p className="italic">
            "Even the best chefs sometimes lose track of their ingredients!" 🧑‍🍳
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}