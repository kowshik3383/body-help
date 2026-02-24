import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/src/contexts/UserContext';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { Treatment } from '@/src/types/medical';

interface UseTreatments {
  treatments: Treatment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTreatments(
  bodyPart: string | null,
  diseaseId: string | null
): UseTreatments {
  const { user } = useUser();
  const { language } = useLanguage();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTreatments = useCallback(async () => {
    if (!bodyPart || !diseaseId || !user) {
      setTreatments([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        bodyPart,
        diseaseId,
        language,
        age: user.age.toString(),
        gender: user.gender,
      });

      const res = await fetch(`/api/treatments?${params}`);

      if (!res.ok) {
        throw new Error('Failed to fetch treatments');
      }

      const data = await res.json();
      setTreatments(data.treatments || []);
    } catch (err) {
      console.error('Fetch treatments error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [bodyPart, diseaseId, user, language]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchTreatments();
  }, [fetchTreatments]);

  // Re-fetch when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      fetchTreatments();
    };

    window.addEventListener('language-changed', handleLanguageChange);
    return () => {
      window.removeEventListener('language-changed', handleLanguageChange);
    };
  }, [fetchTreatments]);

  return {
    treatments,
    isLoading,
    error,
    refetch: fetchTreatments,
  };
}
