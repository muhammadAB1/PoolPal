import { testReadingRowToSelections } from '@/data/chooseTestMethod';
import type { OverallStatus, ReadingStatus, SwimmingStatus } from '@/data/readingBands';
import {
  CATALOG_ROWS,
  toBrands,
  type TestStripBrand,
  type TestStripBrandRow,
} from '@/data/testStripBrands';
import { supabase } from '@/lib/Supabase';
import type { TestReadingRow } from '@/lib/types';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type LatestReading = {
  selections: Record<string, string>;
  poolStatus: OverallStatus | null;
  swimmingStatus: SwimmingStatus | null;
  createdAt: string | null;
};

type TestStripContextValue = {
  /** Bundled catalog brands plus any strips this user added. */
  brands: TestStripBrand[];
  selectedBrand: string | null;
  setSelectedBrand: (name: string | null) => void;
  /** Pad readings chosen on select-strip-results (testName → chart value). */
  selections: Record<string, string>;
  setSelections: (next: Record<string, string>) => void;
  /** test_reading row id for this session, set after the first save so a
   *  Back + Continue updates that row instead of inserting a new one. */
  savedReadingId: string | null;
  setSavedReadingId: (id: string | null) => void;
  poolStatus: OverallStatus | null;
  readingStatus: ReadingStatus[];
  swimmingStatus: SwimmingStatus | null;
  setResultStatus: (pool: OverallStatus, reading: ReadingStatus[], swimming: SwimmingStatus) => void;
  /** Last saved reading for the Readings tab. Separate from in-progress session state. */
  latestReading: LatestReading | null;
  /** Bump after a successful insert/update so the latest-reading effect fetches once more. */
  bumpSaveCount: () => void;
  /** Call after the user saves a custom strip so it appears in the list. */
  refreshCustomStrips: () => Promise<void>;
  allReadings: TestReadingRow[];
};

const TestStripContext = createContext<TestStripContextValue | undefined>(
  undefined,
);

/**
 * One shared box for the test-strip flow and the Readings tab.
 * Mounted at the root so both screens see the same latest-reading cache.
 */
export function TestStripProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { poolId, loading: poolLoading } = usePool();
  const [customRows, setCustomRows] = useState<TestStripBrandRow[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [poolStatus, setPoolStatus] = useState<OverallStatus | null>(null);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus[]>([]);
  const [swimmingStatus, setSwimmingStatus] = useState<SwimmingStatus | null>(null);
  const [latestReading, setLatestReading] = useState<LatestReading | null>(null);
  const [allReadings, setAllReadings] = useState<TestReadingRow[]>([]);
  const [saveCount, setSaveCount] = useState(0);

  const bumpSaveCount = useCallback(() => {
    setSaveCount((count) => count + 1);
  }, []);

  const refreshCustomStrips = useCallback(async () => {
    if (authLoading || poolLoading) return;

    if (!user) {
      setCustomRows([]);
      return;
    }

    const { data } = await supabase
      .from('test_strips')
      .select('product_brand, product_model')
      .eq('user_id', user.id);

    setCustomRows(data ?? []);
  }, [authLoading, poolLoading, user]);

  useEffect(() => {
    refreshCustomStrips();
  }, [refreshCustomStrips]);

  useEffect(() => {
    if (authLoading || poolLoading) return;

    if (!user || !poolId) {
      setLatestReading(null);
      return;
    }

    void supabase
      .from('test_reading')
      .select('*')
      .eq('pool_id', poolId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data) {
          setLatestReading(null);
          return;
        }

        setAllReadings(data as TestReadingRow[]);

        setLatestReading({
          selections: testReadingRowToSelections(data[0]),
          poolStatus: data[0].pool_status ?? null,
          swimmingStatus: data[0].swimming_status ?? null,
          createdAt: data[0].created_at ?? null,
        });
      });
  }, [authLoading, poolLoading, user, poolId, saveCount]);

  return (
    <TestStripContext.Provider
      value={{
        brands: toBrands([...CATALOG_ROWS, ...customRows]),
        selectedBrand,
        setSelectedBrand,
        selections,
        setSelections,
        savedReadingId,
        setSavedReadingId,
        poolStatus,
        readingStatus,
        swimmingStatus,
        setResultStatus: (pool, reading, swimming) => {
          setPoolStatus(pool);
          setReadingStatus(reading);
          setSwimmingStatus(swimming);
        },
        latestReading,
        bumpSaveCount,
        refreshCustomStrips,
        allReadings,
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
