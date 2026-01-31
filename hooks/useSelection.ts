import { useState, useCallback } from 'react';
import { SelectionState } from '@/types/medical';

export function useSelection() {
  const [selection, setSelection] = useState<SelectionState>({
    bodyPart: null,
    disease: null,
  });

  const selectBodyPart = useCallback((bodyPartId: string | null) => {
    setSelection({ bodyPart: bodyPartId, disease: null });
  }, []);

  const selectDisease = useCallback((diseaseId: string | null) => {
    setSelection((prev) => ({ ...prev, disease: diseaseId }));
  }, []);

  const reset = useCallback(() => {
    setSelection({ bodyPart: null, disease: null });
  }, []);

  return {
    selection,
    selectBodyPart,
    selectDisease,
    reset,
  };
}
