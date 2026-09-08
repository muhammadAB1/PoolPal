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
 * Clears expired tasks in AsyncStorage and returns how many required tasks are still done,
 * plus the ids of required tasks that are not done yet.
 */
export async function expireStaleChecklistTasks(): Promise<{
  completed: number;
  incompleteIds: string[];
}> {
  const ids = CHECKLIST_SECTIONS.flatMap((section) => section.tasks.map((task) => task.id));
  const keys = ids.map((id) => `checklist.${id}`);
  const entries = await AsyncStorage.multiGet(keys);
  const updates: [string, string][] = [];
  const doneRequired = new Set<string>();

  for (const [key, raw] of entries) {
    if (!raw) continue;

    const data = JSON.parse(raw) as { done?: boolean; completedAt?: string | null };
    if (data.done && isChecklistTaskExpired(data.completedAt)) {
      updates.push([key, JSON.stringify({ done: false, completedAt: null })]);
      continue;
    }

    const taskId = key.replace('checklist.', '');
    if (data.done && REQUIRED_IDS.has(taskId)) doneRequired.add(taskId);
  }

  if (updates.length > 0) {
    await AsyncStorage.multiSet(updates);
  }

  const completed = doneRequired.size;
  await AsyncStorage.setItem('checklist.completedCount', String(completed));
  return {
    completed,
    incompleteIds: REQUIRED_TASK_IDS.filter((id) => !doneRequired.has(id)),
  };
}
