import type { Href } from 'expo-router';

/**
 * When a user resumes onboarding from the dashboard's "N details left" card,
 * the queue of still-missing steps is threaded through each screen via the
 * `remaining` search param (a comma-separated list of route names), so every
 * screen knows what to show next without needing a fresh server round trip.
 */
export function parseRemainingSteps(remaining?: string | string[] | null): string[] {
  if (!remaining) return [];
  const value = Array.isArray(remaining) ? remaining[0] : remaining;
  return value ? value.split(',').filter(Boolean) : [];
}

/**
 * Returns where to go next while resuming onboarding: the next missing step
 * (carrying the rest of the queue along), or the onboarding-complete screen
 * once the queue is empty (it falls back to the pool already in context, so
 * no params need to be threaded through here).
 */
export function resumeOnboardingHref(remaining: string[]): Href {
  if (remaining.length === 0) {
    return '/(onboarding)/onboarding-complete' as Href;
  }

  const [nextStep, ...rest] = remaining;
  return {
    pathname: `/(onboarding)/${nextStep}`,
    params: { resume: '1', remaining: rest.join(',') },
  } as Href;
}
