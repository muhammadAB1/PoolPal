import { REQUIRED_TASK_IDS } from '@/data/checklist';

type Tasks = Record<string, { done: boolean; completedAt: string | null }>;

function getWeekStart() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (now.getDay() === 0 ? -6 : 1 - now.getDay()));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function isChecklistTaskExpired(completedAt: string | null | undefined) {
  return !!completedAt && new Date(completedAt) < getWeekStart();
}

export function checklistProgress(tasks: Tasks) {
  const incompleteIds = REQUIRED_TASK_IDS.filter(
    (id) => !tasks[id]?.done || isChecklistTaskExpired(tasks[id].completedAt),
  );
  return { completed: REQUIRED_TASK_IDS.length - incompleteIds.length, incompleteIds };
}
