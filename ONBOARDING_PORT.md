# Onboarding port playbook

When the user names the next onboarding screen (and nothing else), follow this file. Do not ask for a recap of these rules.

Example: `pool-size-gallons` means edit Frontend’s existing `pool-size-gallons` screen using PoolTonic’s matching screen as the **UI + copy + missing-questions** source.

---

## What the user will send

Only the screen name, for example:

- `pool-size-gallons`
- `pool-condition`
- `equipment-basics`
- `surface-type`
- `cleaning-setup`
- `test-readings`
- `weekly-reminder`
- `onboarding-complete`

Match it to the same file under `Frontend/app/(onboarding)/`. Compare with `PoolTonic-pooltonic-consolidated-20260916/app/(onboarding)/`.

---

## Hard limits — do not create files or folders

The only kinds of change needed are:

1. **UI revamp** in the existing Frontend screen (layout, box size, text size, follow-up nesting).
2. **Text** in existing `Frontend/data/translations.ts` (EN and ES).
3. **New `useState`s** on that existing screen for fields that Frontend does not already have.
4. **Types** on existing `Frontend/lib/types.ts` (`Pool` and related unions).
5. **Hook write** on existing `Frontend/hooks/supabaseHooks.ts` (that screen’s insert/update).
6. **Provider** stays `select('*')` in existing `Frontend/providers/PoolProvider.tsx`. New columns type-check because `Pool` was extended.

Do **not**:

- Create new files, folders, components, hooks, providers, or SQL/migration files.
- Copy PoolTonic’s folder structure, file names, `OnboardingFooter`, `pool-basics-v2` modules, or StyleSheet-only architecture into new files.
- Replace the Frontend screen file with PoolTonic’s file.
- Add unused PoolTonic columns or a second question for a fact Frontend already captures under a different name.

If an image is missing, import it through the **existing** `Frontend/constants/images.ts` and put the asset in an **existing** Frontend assets folder. Do not add a new images module.

---

## Source of truth

| Thing | Source |
|---|---|
| File path, exports, routing, embed props (`initial*`, `onSuccess`, `showSkip`, `markStale`, `forceCreate` / `newPool`) | **Frontend** |
| Code style (NativeWind classes already on the screen, existing `SelectionCard` / `ChoiceButton` if present, existing Continue / Skip footer pattern, existing hook names) | **Frontend** |
| Saved field **values** that already exist (e.g. `Family`, `Attached`, `Screened`) | **Frontend** |
| Visible UI: card size, grid, wide rows, nested follow-ups, missing-details list, disabled Continue | **PoolTonic** |
| Visible **text** (titles, subtitles, labels, descriptions, buttons, missing-list copy) | **PoolTonic** (canonical last `Object.assign` strings in PoolTonic `data/translations.ts`) |
| Questions / options / follow-ups Frontend does not already have | **PoolTonic** |

Frontend is the base. PoolTonic is not a file to paste. It is the look, the wording, and the missing questions.

---

## How to implement a named screen

1. Open Frontend `app/(onboarding)/<name>.tsx` and PoolTonic `app/(onboarding)/<name>.tsx`.
2. Keep Frontend’s file, function signature, navigation, skip/new-pool behavior, and save hook.
3. Restyle that file so it **looks like PoolTonic**: same box sizes, image sizes, 2-column vs wide stacked cards, nested follow-ups, missing-details card if PoolTonic has one, Continue disabled until visible required answers are filled.
4. Put PoolTonic copy into existing `translations.ts` keys (or add keys **in that same file**). Every visible string on the screen must match PoolTonic. Do not keep old Frontend wording.
5. Add only options/follow-ups that Frontend does not already have. If Frontend already asks the same fact under another name, keep Frontend’s stored value and show PoolTonic’s label/layout.
6. Add `useState` only for truly new fields.
7. Extend `Pool` in `lib/types.ts`. Teach the existing insert/update in `supabaseHooks.ts` to write:
   - old columns from old state
   - new columns from new state
8. Do not change `PoolProvider` query. It already `select('*')`.
9. If the Pool tab reuses this screen (`Frontend/app/(pool)/...`), pass the new initial fields there too. Edit those existing files; do not create new ones.
10. End by listing **columns / input fields the user must add in Supabase**. No SQL file.

---

## UI rules (copy PoolTonic visually)

- Card width, min height, image size, padding, border radius, and 2-up vs stacked-wide layout must match PoolTonic, not the old skinny Frontend cards.
- Follow-up logic must match PoolTonic (what appears after Saltwater, spa Yes, seasonal, etc.).
- If PoolTonic shows “a few details are still missing” and disables Continue, do that.
- Keep using the Frontend screen’s existing Continue / Skip chrome unless that screen already shares a Frontend footer component. Do not add PoolTonic’s `OnboardingFooter` as a new file.
- Implement PoolTonic layout **inside the existing Frontend file** (local helpers in that file are fine). Do not extract new shared components for this port.

---

## Text rules

- Titles, subtitles, card titles, descriptions, yes/no, months, missing-list lines, errors = PoolTonic canonical copy, EN and ES.
- Do not invent shorter Frontend labels.
- Saved enums can stay Frontend (`Family`, `Attached`, `Detached`, …) while the **label on screen** is PoolTonic (`Primary Home`, `Attached / shared system`, …).

---

## Questions / options rules

- Add an option only if it is not already on the Frontend screen (example: Bromine on sanitizer).
- Do not duplicate a fact. Example: “how many people swim” **is** bather load — do not add a second people question.
- Same follow-up, different PoolTonic name → keep Frontend stored names, match PoolTonic UI/copy.
- **Other / I don’t know** (pool sanitizer) is stored and treated as **Chlorine**. Spa sanitizer “I don’t know” is stored as **chlorine**.

---

## Types, state, hook, provider

- New unions/fields only for new follow-ups, on existing `lib/types.ts`.
- Do not replace Frontend `poolType` / `pool_use_type` with unused PoolTonic unions (`SanitizerSystem`, `PropertyUse`, `TypicalBatherLoad`, …) unless that union **is** the new column’s value.
- `PoolProvider`: still `select('*')`. No new provider files.

---

## Database — tell the user, never write SQL

After each screen, list every **new** column or input they must add. For each:

- table (`pools` unless the screen uses another existing table)
- column name
- type (`text`, `text[]`, number, …)
- allowed values
- default if any

Do not add columns Frontend already has. Do not create `supabase/migrations` or any `.sql` file.

Also mention enum values the existing column must accept (example: `Bromine` on `pool_type`) if the UI can save them.

---

## Do not touch

- Auth, profiles, city/town requiredness.
- PoolTonic repo files.
- This playbook’s meaning mid-screen unless the user changes a rule.
- Creating todos for later screens the user did not name.

---

## Done checklist (every named screen)

- [ ] Only existing Frontend files edited. No new files/folders/SQL.
- [ ] UI sizes, layout, and follow-ups match PoolTonic.
- [ ] All visible text matches PoolTonic (EN + ES).
- [ ] Missing PoolTonic options/follow-ups added; no duplicate facts; Frontend stored values kept where the fact already existed.
- [ ] New state, `Pool` types, and hook writes only for new fields.
- [ ] Provider still `select('*')`.
- [ ] User was told the exact new columns / enum values to add.

---

## What pool-basics already did (do not redo)

Treat this as the pattern, not a second pass.

**UI / copy from PoolTonic**

- 2-column sanitizer cards, wide stacked use cards, nested salt/spa/season follow-ups, missing-details list, Continue disabled.
- PoolTonic wording for sanitizer, environment, spa, property use, months, bathers, missing list.

**Options added that Frontend did not have**

- Bromine; salt working / not working + manual chlorine notices; detached spa sanitizer; vacation year-round/seasonal + unused months; STR year-round/seasonal + active months; environment Outdoor / Screened / Covered / Indoor (still saved on `pool_screen` as Screened vs Unscreened); bather chips 1–2 / 3–5 / 6–10 / 10+ (still saved on `number_of_users` as `1-2` / `3-4` / `5+`).

**Kept Frontend stored values**

- `pool_type`, `pool_screen`, `hot_tub_type`, `spa_attachment`, `pool_use_type`, `usage_frequency`, `number_of_users`.
- Other / I don’t know → saved as Chlorine.

**New `pools` columns the user adds (no SQL file)**

| Column | Type | Values |
|---|---|---|
| `salt_system_status` | text | `working` \| `not_working` |
| `manual_chlorine_during_salt_failure` | text | `yes` \| `no` |
| `standalone_spa_sanitizer` | text | `chlorine` \| `saltwater` \| `bromine` \| `unknown` (unknown is saved as `chlorine`) |
| `occupancy_pattern` | text | `year_round` \| `seasonal` |
| `seasonal_unused_months` | text[] | default `'{}'` |
| `rental_activity` | text | `year_round` \| `seasonal` |
| `rental_active_months` | text[] | default `'{}'` |

If `pool_type` is an enum, it must also accept `Bromine` (Other is not stored; it becomes Chlorine).

Do not add `sanitizer_system`, `pool_environment`, `property_use`, or `typical_bather_load` for pool-basics.
