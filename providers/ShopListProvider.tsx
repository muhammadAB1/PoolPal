import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type ShopListValue = {
  /** Saved product ids, newest first. */
  savedIds: string[];
  isSaved: (productId: string) => boolean;
  toggleSaved: (productId: string) => void;
  removeSaved: (productId: string) => void;
};

const ShopListContext = createContext<ShopListValue>({
  savedIds: [],
  isSaved: () => false,
  toggleSaved: () => {},
  removeSaved: () => {},
});

/**
 * Holds the products a user added to "My list".
 * UI-only version: lives in memory, no storage and no backend.
 */
export function ShopListProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const isSaved = useCallback((productId: string) => savedIds.includes(productId), [savedIds]);

  const toggleSaved = useCallback((productId: string) => {
    void Haptics.selectionAsync().catch(() => {});
    setSavedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
    );
  }, []);

  const removeSaved = useCallback((productId: string) => {
    setSavedIds((prev) => prev.filter((id) => id !== productId));
  }, []);

  const value = useMemo(
    () => ({ savedIds, isSaved, toggleSaved, removeSaved }),
    [savedIds, isSaved, toggleSaved, removeSaved],
  );

  return <ShopListContext.Provider value={value}>{children}</ShopListContext.Provider>;
}

export function useShopList() {
  return useContext(ShopListContext);
}
