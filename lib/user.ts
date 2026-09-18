import type { User } from '@supabase/supabase-js';

/** First name from the profile `name` loaded by AuthProvider, or null if unavailable. */
export function getFirstName(name: string | null): string | null {
  const first = name?.trim().split(/\s+/)[0];
  return first || null;
}

/** Avatar image URL from Google OAuth metadata, or null if unavailable. */
export function getAvatarUrl(user: User | null): string | null {
  const metadata = user?.user_metadata as Record<string, unknown> | undefined;
  return (metadata?.avatar_url as string | undefined) ?? (metadata?.picture as string | undefined) ?? null;
}

/** Two-letter initials from the profile name, falling back to the email's first letter. */
export function getInitials(name: string | null, email?: string | null): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase();
  }

  return email ? email[0].toUpperCase() : '?';
}
