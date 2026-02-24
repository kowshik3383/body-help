import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { Disease } from '@/src/types/medical';

interface UseDiseases {
  diseases: Disease[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDiseases(bodyPart: string | null): UseDiseases {
  const { user } = useUser();
  const { language } = useLanguage();
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiseases = useCallback(async () => {
    if (!bodyPart || !user) {
      setDiseases([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        bodyPart,
        language,
        age: user.age.toString(),
        gender: user.gender,
      });

      const res = await fetch(`/api/diseases?${params}`);

      if (!res.ok) {
        throw new Error('Failed to fetch diseases');
      }

      const data = await res.json();
      setDiseases(data.diseases || []);
    } catch (err) {
      console.error('Fetch diseases error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [bodyPart, user, language]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchDiseases();
  }, [fetchDiseases]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      fetchDiseases();
    };

    window.addEventListener('language-changed', handleLanguageChange);
    return () => {
      window.removeEventListener('language-changed', handleLanguageChange);
    };
  }, [fetchDiseases]);

  return {
    diseases,
    isLoading,
    error,
    refetch: fetchDiseases,
  };
}
