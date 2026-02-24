'use client';

import { OnboardingData, Gender } from "@/src/types/user";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function PersonalDetailsScreen({
  formData,
  setFormData,
  onNext,
  step,
  total,
}: {
  formData: OnboardingData;
  setFormData: (data: OnboardingData) => void;
  onNext: () => void;
  step: number;
  total: number;
}) {
  const handleChange = (field: keyof OnboardingData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const isValid = formData.name.trim().length > 0 && formData.age > 0;

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
                className={`h-0.5 rounded-full transition-all duration-700 ${
                  i < step
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
              Tell us about yourself
            </h1>
            <p className="text-base text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              Help us personalize your health experience
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-light placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                placeholder="Enter your name"
              />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Age
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
                min={1}
                max={150}
                className="w-full px-0 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-light placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors"
                placeholder="Your age"
              />
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['male', 'female', 'other'] as Gender[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => handleChange('gender', g)}
                    className={`py-3 px-4 rounded-lg text-sm font-light transition-all duration-200 ${
                      formData.gender === g
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Preferred Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-0 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-light focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors appearance-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ml">മലയാളം (Malayalam)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>

            {/* Health Goal */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Health Goal <span className="normal-case text-slate-400">(Optional)</span>
              </label>
              <textarea
                value={formData.healthGoal}
                onChange={(e) => handleChange('healthGoal', e.target.value)}
                rows={3}
                className="w-full px-0 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-light placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors resize-none"
                placeholder="E.g., Improve cardiovascular health, manage diabetes..."
              />
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-6"
          >
            <button
              onClick={onNext}
              disabled={!isValid}
              className="group w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 dark:disabled:hover:bg-white disabled:active:scale-100"
            >
              Continue
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}