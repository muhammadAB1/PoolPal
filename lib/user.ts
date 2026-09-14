import type { User } from '@supabase/supabase-js';

/** First name from the Google OAuth profile, or null if unavailable. */
export function getFirstName(user: User | null): string | null {
  const fullName = user?.user_metadata?.full_name as string | undefined;
  const first = fullName?.trim().split(/\s+/)[0];
  return first || null;
}

/** Avatar image URL from Google OAuth metadata, or null if unavailable. */
export function getAvatarUrl(user: User | null): string | null {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  return (metadata?.avatar_url as string | undefined) ?? (metadata?.picture as string | undefined) ?? null;
}

/** Two-letter initials from the full name, falling back to the email's first letter. */
export function getInitials(user: User | null): string {
  const fullName = user?.user_metadata?.full_name as string | undefined;

  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase();
  }

  return user?.email ? user.email[0].toUpperCase() : '?';
}
