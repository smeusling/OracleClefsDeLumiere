import { useCallback, useState } from 'react';

const CARD_COUNT = 33;

export function useOracle() {
  const [drawnId, setDrawnId] = useState<string | null>(null);

  const draw = useCallback(() => {
    const n = Math.floor(Math.random() * CARD_COUNT) + 1;
    setDrawnId(String(n).padStart(2, '0'));
  }, []);

  const reset = useCallback(() => {
    setDrawnId(null);
  }, []);

  return { drawnId, draw, reset };
}
