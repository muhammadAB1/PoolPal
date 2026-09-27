# Update the Solve Visible Problems questions

Use this file when you ask an AI to change the Solve Visible Problems questions. The screens, buttons, and treatment page already work. The questions on each page, and which answer leads to which page, are placeholders and are wrong. Your job is to replace that content.

## What to paste into the AI chat

Attach this file and `app/(problems)/_tree.ts`, then describe the questions in plain language. You can start with:

> Read `app/(problems)/QUESTION_FLOW.md` and follow it. Update the Solve Visible Problems question flow in `app/(problems)/_tree.ts` only. Here is the correct flow: …

Then list each question, its answers, and where each answer should go next.

---

## Rules for the AI

Follow these rules for every request about this feature.

1. Edit only `app/(problems)/_tree.ts`.
2. Do not edit screens, layout, styles, components, providers, the treatment page, or any other feature.
3. Do not add libraries.
4. Do not rebuild the flow. The app already renders whatever is in `_tree.ts`.
5. Replace the placeholder questions and the placeholder routing. Do not keep a branch just because it is already in the file.
6. If a change truly cannot be done inside `_tree.ts`, stop and read `AGENTS.md` at the project root before touching anything else. `AGENTS.md` is the rulebook for the whole app, not only this feature. Then change only the extra file that is required, and say which file you changed and why.

The only extra files that are allowed, and only when they are required:

| Need | File | When |
| --- | --- | --- |
| New wording the app does not already have | `data/translations.ts` | A title, subtitle, answer, or warning needs words that are not already in that file |
| A new picture on an answer | `constants/images.ts`, plus the image file under `assets/` | The partner asked for a picture, and `poolConditionImages` does not already have it |

Before either of those, read `AGENTS.md` and follow it. In particular: all user-facing text lives in `data/translations.ts`, and images are imported through `constants/images.ts`. Do not import an image directly inside a screen.

---

## How this file works

`app/(problems)/_tree.ts` has three parts. The question screen reads all three. You do not need to change the screen.

### 1. `QUESTION_PAGES`

Every question page is one entry. The screen starts on the page whose id is `appearance`. Keep that id. You may change its title, subtitle, and answers. If the first question must use a different id, that also requires a one-line change in `app/(problems)/questions.tsx` where the screen sets the starting page. That is an extra file, so read `AGENTS.md` first and change only that starting id.

Each page looks like this:

```ts
appearance: {
    id: 'appearance',
    titleKey: 'problems_some_title',
    subtitleKey: 'problems_some_subtitle', // optional
    multiple: false, // false = pick one, true = pick many
    options: [
        {
            id: 'CRYSTAL_CLEAR',
            labelKey: 'problems_some_label',
            descriptionKey: 'problems_some_desc', // optional
            image: poolConditionImages.CRYSTAL_CLEAR, // optional, first page only today
        },
    ],
},
```

Rules for a page:

- `id` on the page and the object key must be the same string.
- `multiple: false` means one answer. `multiple: true` means the user can select several.
- Every `option.id` on a page must be unique.
- `titleKey`, `subtitleKey`, `labelKey`, and `descriptionKey` are names of sentences. They are not the sentence itself. The sentence is in `data/translations.ts`.
- Leave `image` off an answer unless that answer should show a picture. Later questions are text only.
- Reuse an existing key when the wording already matches. The visible English and Spanish for the current keys are in `data/translations.ts` under `en` and `es`.
- Do not edit existing `pool_condition_*` sentences. Those keys are also used by pool setup. If this flow needs different wording, add a new `problems_*` key in both `en` and `es`.
- A key that is missing from `en` or `es` shows up on screen as the raw key name, such as `problems_some_title`.

### 2. `getNextAction`

This function decides the next page after the user taps Continue.

The screen calls it like this:

```ts
getNextAction([...history, page], selected)
```

- `pages` is every page visited so far, including the page the user is on. The current page is `pages[pages.length - 1]`.
- `selected` is only the answer ids chosen on the current page. It is not the answers from earlier pages.
- Return `{ type: 'question', page: 'some_page_id' }` to open another question. That id must exist in `QUESTION_PAGES`.
- Return `{ type: 'treatment' }` when the questions are finished. The app then opens the treatment screen. Do not edit that screen.
- Match answer ids exactly. `selected.includes('GREEN')` only works if an option id is `GREEN`.
- On a multi-select page, say what happens when more than one answer is selected. Check the more specific answers first.
- You can look at earlier pages with `pages.includes('some_page_id')` when the next step depends on a page the user already saw.
- Every page in `QUESTION_PAGES` needs a path forward. A page with no branch falls through to treatment.

### 3. `getPageWarning`

This shows a red warning on the current page while certain answers are selected. It does not change where Continue goes.

```ts
if (page === 'very_green_followup' && (selected.includes('NO') || selected.includes('NOT_SURE'))) {
    return {
        titleKey: 'problems_warning_keep_swimmers_out',
        subtitleKey: 'problems_warning_keep_swimmers_out_desc',
    };
}
```

Return `null` when that page should not show a warning. Add a warning only when the partner asks for one.

---

## How to describe a change

Write one block per question. The AI should turn that into pages and `getNextAction` branches.

```txt
Page id: appearance
Question: What does your pool look like today?
Help text: Pick the closest match.
Pick one.

- Crystal clear → go to visible_signs
- Green → go to growth_color
- Very green or dark → go to very_green_followup
  Warning if this is selected: Keep swimmers out for now / Cloudy or dark water can hide someone who needs help.
```

For a question where several answers can be selected:

```txt
Page id: visible_signs
Question: What else are you noticing?
Help text: Select everything that applies.
Pick many.

- Algae → if selected, go to growth_color
- Foam → if selected, and algae was not selected, go to foam_followup
- None of these → go to looks_normal
```

If you do not name a page id, the AI may keep an existing id or create a short snake_case id. Once an id is used in `getNextAction`, it must match the page id exactly.

---

## Pictures

The first question can show a picture on each answer. Those pictures already exist:

- `poolConditionImages.CRYSTAL_CLEAR`
- `poolConditionImages.A_LITTLE_CLOUDY`
- `poolConditionImages.GREEN`
- `poolConditionImages.VERY_GREEN_OR_DARK`
- `poolConditionImages.NOT_SURE`

They are defined in `constants/images.ts`. Reuse one of these when it matches.

Ask for a new picture only when none of these fit. The AI must then read `AGENTS.md`, add the image under `assets/`, export it from `constants/images.ts`, and reference that export from `_tree.ts`.

---

## Done when

- Only `_tree.ts` changed, unless a new sentence or a new picture forced one of the extra files above.
- The first page id is still `appearance`.
- Every next-page id exists in `QUESTION_PAGES`.
- Every answer id used in `getNextAction` or `getPageWarning` exists on that page.
- New sentences exist in both `en` and `es` inside `data/translations.ts`.
- Existing `pool_condition_*` sentences were left unchanged.
