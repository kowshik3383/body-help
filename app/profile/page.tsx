'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/src/contexts/UserContext';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { ArrowLeft, Edit2, Save, X } from 'lucide-react';
import { LanguageCode } from '@/src/types/language';
import Image from 'next/image';
import { Preloader } from '@/src/components/Preloader';

export default function ProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { setLanguage } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    language: user?.language || 'en',
    healthGoal: user?.healthGoal || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        language: user.language,
        healthGoal: user.healthGoal || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          language: formData.language,
          healthGoal: formData.healthGoal || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');

      // Update global language if changed
      if (formData.language !== user.language) {
        setLanguage(formData.language as LanguageCode);
      }

      await refreshUser();
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        language: user.language,
        healthGoal: user.healthGoal || '',
      });
    }
    setIsEditing(false);
  };

  const languageNames: Record<string, string> = {
    en: 'English',
    hi: 'हिंदी (Hindi)',
    ta: 'தமிழ் (Tamil)',
    te: 'తెలుగు (Telugu)',
    kn: 'ಕನ್ನಡ (Kannada)',
    ml: 'മലയാളം (Malayalam)',
    bn: 'বাংলা (Bengali)',
    mr: 'मराठી (Marathi)',
    gu: 'ગુજરાતી (Gujarati)',
    pa: 'ਪੰਜਾਬੀ (Punjabi)',
  };

  if (!user) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-[#201604] dark:via-[#2a1c06] dark:to-[#160f02]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.03),rgba(255,255,255,0))]" />
        <div className="relative text-center">
          <div className="w-12 h-12 border-2 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400 font-light">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profileItems = [
    { label: "Name", value: user.name },
    { label: "Age", value: `${user.age} years` },
    { label: "Gender", value: user.gender.charAt(0).toUpperCase() + user.gender.slice(1) },
    {
      label: "Member Since",
      value: new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 dark:from-[#201604] dark:via-[#2a1c06] dark:to-[#160f02]">
      {/* Subtle background */}
      <Preloader variant="curtain-close" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.03),rgba(255,255,255,0))]" />

      {/* Background image */}
      <Image
        src="/bg1.png"
        alt="Background"
        fill
        priority
        className="object-cover object-center opacity-[0.02] dark:opacity-[0.05]"
      />

      {/* Header */}
      <header className="relative bg-white/40 dark:bg-black/20 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-light">Back</span>
            </button>
            <h1 className="text-lg font-light text-slate-900 dark:text-white">
              Profile
            </h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative container mx-auto px-6 py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Profile Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-light text-slate-900 dark:text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-light tracking-tight text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light mt-1">
                  {user.age} years • {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Information
            </h3>
            <div className="space-y-4">
              {profileItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-start justify-between py-3 border-b border-slate-200 dark:border-slate-800"
                >
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white font-light text-right">
                    {item.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                Preferences
              </h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Preferred Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
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

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Health Goal
                  </label>
                  <textarea
                    value={formData.healthGoal}
                    onChange={(e) =>
                      setFormData({ ...formData, healthGoal: e.target.value })
                    }
                    rows={3}
                    className="w-full px-0 py-3 bg-transparent border-b border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-lg font-light placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-colors resize-none"
                    placeholder="E.g., Improve cardiovascular health, manage diabetes..."
                  />
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start justify-between py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Language
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white font-light text-right">
                    {languageNames[user.language] || user.language}
                  </span>
                </div>
                <div className="flex items-start justify-between py-3 border-b border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Health Goal
                  </span>
                  <span className="text-sm text-slate-900 dark:text-white font-light text-right max-w-[60%]">
                    {user.healthGoal || 'Not set'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}