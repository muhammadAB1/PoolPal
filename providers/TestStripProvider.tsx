import {
  CATALOG_ROWS,
  toBrands,
  type TestStripBrand,
  type TestStripRow,
} from '@/data/testStripBrands';
import { supabase } from '@/lib/Supabase';
import { useAuth } from '@/providers/AuthProvider';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type TestStripContextValue = {
  /** Bundled catalog brands plus any strips this user added. */
  brands: TestStripBrand[];
  selectedBrand: string | null;
  setSelectedBrand: (name: string | null) => void;
  /** Call after the user saves a custom strip so it appears in the list. */
  refreshCustomStrips: () => Promise<void>;
};

const TestStripContext = createContext<TestStripContextValue | undefined>(
  undefined,
);

/**
 * Mounted by the readings layout so the brand list and the current selection
 * survive every push/back inside the flow without refetching.
 */
export function TestStripProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [customRows, setCustomRows] = useState<TestStripRow[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const refreshCustomStrips = useCallback(async () => {
    if (!user) {
      setCustomRows([]);
      return;
    }

    const { data } = await supabase
      .from('test_strips')
      .select('product_brand, product_model')
      .eq('user_id', user.id);

    setCustomRows(data ?? []);
  }, [user]);

  useEffect(() => {
    refreshCustomStrips();
  }, [refreshCustomStrips]);

  return (
    <TestStripContext.Provider
      value={{
        brands: toBrands([...CATALOG_ROWS, ...customRows]),
        selectedBrand,
        setSelectedBrand,
        refreshCustomStrips,
      }}
    >
      {children}
    </TestStripContext.Provider>
  );
}

export function useTestStrips() {
  const context = useContext(TestStripContext);

  if (context === undefined) {
    throw new Error('useTestStrips must be used within a TestStripProvider');
  }

  return context;
}
