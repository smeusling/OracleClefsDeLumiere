import { useCallback, useState } from 'react';


export function useOracle() {
  const [drawnId, setDrawnId] = useState<string | null>(null);

  const draw = useCallback(() => {
    setDrawnId('08');
  }, []);

  const reset = useCallback(() => {
    setDrawnId(null);
  }, []);

  return { drawnId, draw, reset };
}
