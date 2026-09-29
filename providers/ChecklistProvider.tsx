import { supabase } from '@/lib/Supabase';
import { useAuth } from '@/providers/AuthProvider';
import { usePool } from '@/providers/PoolProvider';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

export type ChecklistTasks = Record<string, { done: boolean; completedAt: string | null }>;

type Value = { checklist: ChecklistTasks; setTask: (id: string, done: boolean) => void };

const ChecklistContext = createContext<Value>({ checklist: {}, setTask: () => { } });

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const { poolId } = usePool();
  const { user } = useAuth();
  const [checklist, setChecklist] = useState<ChecklistTasks>({});
  const pending = useRef<ChecklistTasks>({});
  const poolRef = useRef(poolId);
  const userRef = useRef(user?.id);
  const dirty = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  userRef.current = user?.id;

  const save = (id: string | null) => {
    const userId = userRef.current;
    if (id && userId) {
      void supabase.from('checklists').update(
        { checklist_tasks: pending.current },
      ).eq('pool_id', id).then(({ data, error }) => {
      });
    }
  };

  useEffect(() => {
    const id = poolId;
    poolRef.current = id;
    if (!id) setChecklist({});
    else {
      void supabase.from('checklists').select('checklist_tasks').eq('pool_id', id).maybeSingle().then(({ data, error }) => {
        if (poolRef.current !== id) return;
        const next = (data?.checklist_tasks as ChecklistTasks) ?? {};
        pending.current = next;
        setChecklist(next);
      });
    }
    return () => {
      clearTimeout(timer.current);
      if (dirty.current) { save(poolRef.current); dirty.current = false; }
    };
  }, [poolId]);

  const setTask = useCallback((id: string, done: boolean) => {
    setChecklist((prev) => {
      const next = { ...prev, [id]: { done, completedAt: done ? new Date().toISOString() : null } };
      pending.current = next;
      dirty.current = true;
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { save(poolRef.current); dirty.current = false; }, 5000);
      return next;
    });
  }, []);

  return <ChecklistContext.Provider value={{ checklist, setTask }}>{children}</ChecklistContext.Provider>;
}

export function useChecklist() {
  return useContext(ChecklistContext);
}
