import { useState, useCallback } from 'react';

// TODO: importer les données depuis data/cards.json
type CardId = string;

export function useOracle() {
  const [drawnId, setDrawnId] = useState<CardId | null>(null);

  const draw = useCallback(() => {
    // TODO: tirer une carte aléatoire depuis cards.json
    setDrawnId(null);
  }, []);

  const reset = useCallback(() => {
    setDrawnId(null);
  }, []);

  return { drawnId, draw, reset };
}
