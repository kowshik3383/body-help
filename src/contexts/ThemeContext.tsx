'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorPalette = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  hover: string;
  surface: string;
};

export const colorPalettes: Record<string, ColorPalette> = {
  ocean: {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#0ea5e9',
    accent: '#06b6d4',
    hover: '#60a5fa',
    surface: '#eff6ff',
  },
  emerald: {
    name: 'Emerald Green',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#14b8a6',
    hover: '#34d399',
    surface: '#ecfdf5',
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    hover: '#fb923c',
    surface: '#fff7ed',
  },
  purple: {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    hover: '#a78bfa',
    surface: '#f5f3ff',
  },
  rose: {
    name: 'Rose Pink',
    primary: '#f43f5e',
    secondary: '#e11d48',
    accent: '#fb7185',
    hover: '#fb7185',
    surface: '#fff1f2',
  },
  slate: {
    name: 'Slate Gray',
    primary: '#64748b',
    secondary: '#475569',
    accent: '#94a3b8',
    hover: '#94a3b8',
    surface: '#f8fafc',
  },
};

interface ThemeContextType {
  palette: ColorPalette;
  setPalette: (paletteKey: string) => void;
  currentPaletteKey: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPaletteKey, setCurrentPaletteKey] = useState<string>('ocean');
  const [palette, setPaletteState] = useState<ColorPalette>(colorPalettes.ocean);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedPalette = localStorage.getItem('bodyhelp-theme');
    if (savedPalette && colorPalettes[savedPalette]) {
      setCurrentPaletteKey(savedPalette);
      setPaletteState(colorPalettes[savedPalette]);
      applyTheme(colorPalettes[savedPalette]);
    } else {
      applyTheme(colorPalettes.ocean);
    }
  }, []);

  const applyTheme = (newPalette: ColorPalette) => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', newPalette.primary);
    root.style.setProperty('--color-secondary', newPalette.secondary);
    root.style.setProperty('--color-accent', newPalette.accent);
    root.style.setProperty('--color-hover', newPalette.hover);
    root.style.setProperty('--color-surface', newPalette.surface);
  };

  const setPalette = (paletteKey: string) => {
    if (colorPalettes[paletteKey]) {
      setCurrentPaletteKey(paletteKey);
      setPaletteState(colorPalettes[paletteKey]);
      applyTheme(colorPalettes[paletteKey]);
      localStorage.setItem('bodyhelp-theme', paletteKey);
    }
  };

  return (
    <ThemeContext.Provider value={{ palette, setPalette, currentPaletteKey }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
