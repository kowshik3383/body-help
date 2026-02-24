'use client';

import { Check } from "lucide-react";
import { OnboardingData } from "@/src/types/user";
import { motion } from "framer-motion";
import Image from "next/image";

export function ReviewScreen({
  formData,
  onSubmit,
  isSubmitting,
  step,
  total,
}: {
  formData: OnboardingData;
  onSubmit: () => void;
  isSubmitting: boolean;
  step: number;
  total: number;
}) {
  const languageNames: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी',
    ta: 'தமிழ்',
    te: 'తెలుగు',
    kn: 'ಕನ್ನಡ',
    ml: 'മലയാളം',
    bn: 'বাংলা',
    mr: 'मराठी',
    gu: 'ગુજરાતી',
    pa: 'ਪੰਜਾਬੀ',
  };

  const reviewItems = [
    { label: "Name", value: formData.name },
    { label: "Age", value: `${formData.age} years` },
    { label: "Gender", value: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) },
    { label: "Language", value: languageNames[formData.language] || formData.language },
    ...(formData.healthGoal ? [{ label: "Health Goal", value: formData.healthGoal }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-[#201604] dark:via-[#2a1c06] dark:to-[#160f02]"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.03),rgba(255,255,255,0))]" />

      {/* Background image */}
   

      {/* Content container */}
      <div className="relative w-full max-w-xl mx-auto px-6 py-12">
        {/* Minimal step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-16"
        >
          <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 rounded-full transition-all duration-700 ${i < step
                  ? 'w-8 bg-slate-900 dark:bg-white'
                  : 'w-8 bg-white dark:bg-slate-800'
                  }`}
              />
            ))}
          </div>
          <span className="text-xs tabular-nums text-slate-400 dark:text-slate-600">
            {step}/{total}
          </span>
        </motion.div>

        {/* Main content */}
        <div className="space-y-10">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white">
              Review & Confirm
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Please review your information before proceeding
            </p>
          </motion.div>

          {/* Review details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {reviewItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-start justify-between py-4 border-b border-slate-200 dark:border-slate-800"
              >
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-sm text-slate-900 dark:text-white font-light text-right max-w-[60%]">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <div className="h-44"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="fixed bottom-0 left-0 right-0 z-50"
          >
            <div className="relative mx-auto max-w-4xl px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">

              {/* Background Layer */}
              <div className="absolute inset-0  backdrop-blur-xl " />

              {/* Button */}
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="relative z-10 group w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium text-sm transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 dark:disabled:hover:bg-white disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Complete Setup</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}