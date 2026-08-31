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

function asSingleParam(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Returns where to go next while resuming onboarding: the next missing step
 * (carrying the rest of the queue along), or the onboarding-complete screen
 * once the queue is empty. `backRoute` is forwarded so the destination knows
 * we came from dashboard (and should refresh pool data when returning).
 */
export function resumeOnboardingHref(
  remaining: string[],
  backRoute?: string | string[],
): Href {
  const route = asSingleParam(backRoute);
  const backParams = route ? { backRoute: route } : {};

  if (remaining.length === 0) {
    return {
      pathname: '/(onboarding)/onboarding-complete',
      params: backParams,
    } as Href;
  }

  const [nextStep, ...rest] = remaining;
  return {
    pathname: `/(onboarding)/${nextStep}`,
    params: { resume: '1', remaining: rest.join(','), ...backParams },
  } as Href;
}
