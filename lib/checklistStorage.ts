import { CHECKLIST_SECTIONS, REQUIRED_TASK_IDS } from '@/data/checklist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REQUIRED_IDS = new Set(REQUIRED_TASK_IDS);

/** Monday 00:00 of the current week — anything saved before this has expired. */
function getWeekStart() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (now.getDay() === 0 ? -6 : 1 - now.getDay()));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/** TEST: expire after 1 minute so we can verify reset without waiting until Monday. */
// function getExpiryCutoff() {
//   return new Date(Date.now() - 60 * 1000);
// }

export function isChecklistTaskExpired(completedAt: string | null | undefined): boolean {
  if (!completedAt) return false;
  return new Date(completedAt) < getWeekStart();
  // TEST: return new Date(completedAt) < getExpiryCutoff();
}

/**
 * Clears expired tasks in AsyncStorage and returns how many required tasks are still done.
 * Dashboard and checklist both use this so a Monday cold start shows 0, not stale 14/14.
 */
export async function expireStaleChecklistTasks(): Promise<number> {
  const ids = CHECKLIST_SECTIONS.flatMap((section) => section.tasks.map((task) => task.id));
  const keys = ids.map((id) => `checklist.${id}`);
  const entries = await AsyncStorage.multiGet(keys);
  const updates: [string, string][] = [];
  let completed = 0;

  for (const [key, raw] of entries) {
    if (!raw) continue;

    const data = JSON.parse(raw) as { done?: boolean; completedAt?: string | null };
    if (data.done && isChecklistTaskExpired(data.completedAt)) {
      updates.push([key, JSON.stringify({ done: false, completedAt: null })]);
      continue;
    }

    const taskId = key.replace('checklist.', '');
    if (data.done && REQUIRED_IDS.has(taskId)) completed += 1;
  }

  if (updates.length > 0) {
    await AsyncStorage.multiSet(updates);
  }
  await AsyncStorage.setItem('checklist.completedCount', String(completed));
  return completed;
}
