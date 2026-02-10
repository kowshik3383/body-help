// Optimizations: Added useCallback for event handlers, improved performance
'use client';

import { useTheme, colorPalettes } from '@/src/contexts/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';

export function ColorThemeSelector() {
  const { currentPaletteKey, setPalette } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handlePaletteSelect = useCallback((key: string) => {
    setPalette(key);
    setIsOpen(false);
  }, [setPalette]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary transition-colors"
        aria-label="Select color theme"
      >
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="hidden sm:inline text-sm font-medium text-gray-900 dark:text-white">
          Theme
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50 min-w-50"
          >
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                Color Theme
              </div>
              {Object.entries(colorPalettes).map(([key, palette]) => (
                <button
                  key={key}
                  onClick={() => handlePaletteSelect(key)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between gap-3 ${
                    currentPaletteKey === key
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: palette.accent }}
                      />
                    </div>
                    <span className="font-medium">{palette.name}</span>
                  </div>
                  {currentPaletteKey === key && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
