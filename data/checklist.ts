/**
 * Hardcoded weekly checklist content.
 * Task `id` matches translation keys under checklist.tasks.*
 */

export type ChecklistTask = {
  id: string;
  badge: 'required' | 'afterTesting' | 'weekly' | 'asNeeded' | 'monthly' | 'optional';
  subtextKey?: string;
  showCompletedAt?: boolean;
  hasChevron?: boolean;
  optional?: boolean;
};

export type ChecklistSection = {
  id: string;
  icon: 'flask-outline' | 'water-outline' | 'hardware-chip-outline' | 'settings-outline' | 'star-outline';
  tasks: ChecklistTask[];
};

export const CHECKLIST_SECTIONS: ChecklistSection[] = [
  {
    id: 'testAndBalance',
    icon: 'flask-outline',
    tasks: [
      { id: 'testWater', badge: 'required', hasChevron: true },
      { id: 'reviewPlan', badge: 'afterTesting', subtextKey: 'adjustmentsAvailable', hasChevron: true },
    ],
  },
  {
    id: 'cleanThePool',
    icon: 'water-outline',
    tasks: [
      { id: 'skimDebris', badge: 'weekly' },
      { id: 'emptySkimmer', badge: 'weekly' },
      { id: 'brushWalls', badge: 'weekly', showCompletedAt: true },
      { id: 'runRobotic', badge: 'weekly', showCompletedAt: true, hasChevron: true },
      { id: 'checkWaterLevel', badge: 'weekly', showCompletedAt: true },
    ],
  },
  {
    id: 'cleaner',
    icon: 'hardware-chip-outline',
    tasks: [
      { id: 'runRoboticCleaner', badge: 'weekly' },
      { id: 'emptyRinseBasket', badge: 'weekly', showCompletedAt: true },
      { id: 'checkCableParts', badge: 'weekly', showCompletedAt: true },
      { id: 'rinseAndStore', badge: 'weekly' },
    ],
  },
  {
    id: 'checkEquipment',
    icon: 'settings-outline',
    tasks: [
      { id: 'checkPressure', badge: 'weekly', subtextKey: 'pressureRange' },
      { id: 'cleanFilter', badge: 'asNeeded', subtextKey: 'backwashInfo' },
      { id: 'inspectEquipment', badge: 'monthly', subtextKey: 'equipmentChecklist', hasChevron: true },
    ],
  },
  {
    id: 'optional',
    icon: 'star-outline',
    tasks: [
      { id: 'logIssues', badge: 'optional', subtextKey: 'trackAttention', hasChevron: true, optional: true },
    ],
  },
];

/** All non-optional task ids — used for progress %. */
export const REQUIRED_TASK_IDS = CHECKLIST_SECTIONS.flatMap((s) =>
  s.tasks.filter((t) => !t.optional).map((t) => t.id),
);

/** e.g. "August 3–9" for the current Monday–Sunday week. */
export function getWeekLabel(locale = 'en-US') {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const month = new Intl.DateTimeFormat(locale, { month: 'long' }).format(monday);
  return `${month} ${monday.getDate()}–${sunday.getDate()}`;
}

/** Next Monday after the current week. */
export function getNextMondayLabel(locale = 'en-US') {
  const now = new Date();
  const day = now.getDay();
  const next = new Date(now);
  next.setDate(now.getDate() + (day === 0 ? 1 : 8 - day));
  return new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric' }).format(next);
}
