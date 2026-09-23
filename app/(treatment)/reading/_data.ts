/**
 * Hardcoded content for the Treatment Plan screen (low pH scenario).
 *
 * Every visible string on `plan.tsx` lives here as plain text — not i18n
 * keys — so this object can later be swapped for content fetched from the
 * database without touching the screen. Icon keys and colors are plain
 * strings/hex values for the same reason; `plan.tsx` maps `TreatmentIconKey`
 * to the actual icon library.
 */

import {
    getIdealStatusRange,
    getReadingStatus,
    type ReadingStatus,
} from '@/data/readingBands';
import { resolvePads } from '@/data/testStripBrands';
import type { Pool } from '@/lib/types';
import { LatestReading } from '@/providers/TestStripProvider';

export type TreatmentIconKey =
    | 'dropper'
    | 'waterDrop'
    | 'measure'
    | 'wave'
    | 'sparkle'
    | 'pill'
    | 'rain'
    | 'trendDown'
    | 'calculator'
    | 'clock';

export type TreatmentStep = {
    id: string;
    number: number;
    icon: TreatmentIconKey;
    title: string;
    /** Sentence under the title. Omitted when the step is only a list. */
    body?: string;
    /** Bullet lines under the body. */
    substeps?: string[];
};

export type TreatmentProduct = {
    id: string;
    badgeLabel: string;
    /** Hex color used for the product's icon badge. */
    accentColor: string;
    name: string;
};

export type TreatmentCause = {
    id: string;
    icon: TreatmentIconKey;
    label: string;
};

export type TreatmentPlanContent = {
    brandLabel: string;
    title: string;
    subtitle: string;
    stepsSectionTitle: string;
    steps: TreatmentStep[];
    alternative: {
        icon: TreatmentIconKey;
        title: string;
        body: string;
    };
    productsSectionTitle: string;
    products: TreatmentProduct[];
    productsFootnote: string;
    causesSectionTitle: string;
    causes: TreatmentCause[];
    dosage: {
        icon: TreatmentIconKey;
        title: string;
        body: string;
    };
    retestNote: string;
    footer: {
        primaryLabel: string;
        secondaryLabel: string;
    };
};

export type NoTreatmentContent = {
    title: string;
    body: string;
    tip: string;
    footer: {
        primaryLabel: string;
    };
};

/** Shown on the Treatment Plan screen when no reading currently needs treatment. */
export const NO_TREATMENT_NEEDED: NoTreatmentContent = {
    title: 'Your pool is safe!',
    body: 'All your tested levels are within their ideal ranges. No treatment is needed right now.',
    tip: 'Keep testing regularly so you can catch changes early.',
    footer: {
        primaryLabel: 'Back to Readings',
    },
};

/** Low pH treatment plan — the only scenario built so far. */
export const TREATMENT_PLAN: TreatmentPlanContent = {
    brandLabel: 'PoolWise',
    title: 'Treatment Plan',
    subtitle: "Here's how to fix low pH safely.",

    stepsSectionTitle: 'What to do',
    steps: [
        {
            id: 'retest-ph',
            number: 1,
            icon: 'dropper',
            title: 'Retest pH',
            body: 'For best results, confirm with a liquid pH test or calibrated digital meter.',
        },
        {
            id: 'test-alkalinity',
            number: 2,
            icon: 'waterDrop',
            title: 'Test total alkalinity',
            body: 'Find out whether alkalinity is also low.',
        },
        {
            id: 'raise-alkalinity',
            number: 3,
            icon: 'measure',
            title: 'If alkalinity is below 80 ppm',
            body: 'Raise alkalinity first with sodium bicarbonate or Alkalinity Increaser.',
        },
        {
            id: 'raise-ph',
            number: 4,
            icon: 'wave',
            title: 'If pH is still low',
            body: 'Circulate, retest, then raise pH with sodium carbonate (pH Up). Start with only part of the label dose.',
        },
    ],

    alternative: {
        icon: 'sparkle',
        title: 'If alkalinity is already normal or high',
        body: 'Try aerating the water first using spa jets, return jets pointed upward, fountains, or waterfalls. Aeration raises pH without materially raising alkalinity.',
    },

    productsSectionTitle: 'Recommended products',
    products: [
        {
            id: 'hth-ph-up',
            badgeLabel: 'pH+',
            accentColor: '#F6B84B',
            name: 'HTH Pool Care pH Up',
        },
        {
            id: 'clorox-ph-up',
            badgeLabel: 'pH Up',
            accentColor: '#F6B84B',
            name: 'Clorox Pool&Spa pH Up',
        },
        {
            id: 'alkalinity-increaser',
            badgeLabel: 'ALKALINITY INCREASER',
            accentColor: '#5ED6D1',
            name: 'HTH or Clorox Alkalinity Increaser',
        },
    ],
    productsFootnote: 'Plain sodium bicarbonate can also raise alkalinity when dosed correctly.',

    causesSectionTitle: 'Common causes',
    causes: [
        { id: 'acid-overdose', icon: 'dropper', label: 'Acid overdose' },
        { id: 'trichlor-tablets', icon: 'pill', label: 'Frequent trichlor tablet use' },
        { id: 'acidic-rainfall', icon: 'rain', label: 'Acidic rainfall' },
        { id: 'low-alkalinity', icon: 'trendDown', label: 'Low alkalinity' },
    ],

    dosage: {
        icon: 'calculator',
        title: 'Useful dosage reference',
        body: 'Approx. 1.4 lb of pure sodium bicarbonate per 10,000 gallons raises total alkalinity by about 10 ppm. Product labels override this estimate.',
    },
    retestNote: 'Retest after at least 4–6 hours of circulation, or according to the product label.',

    footer: {
        primaryLabel: 'Treatment Completed',
        secondaryLabel: 'Use dosage calculator',
    },
};

/** A reading that needs treatment, with the card message the priority rule decided on. */
export type TreatmentAlert = {
    caseId: TreatmentCaseId;
    testName: string;
    value: string;
    message: string;
    /** false when a higher-priority reading makes this one unsafe/unreliable to treat right now. */
    actionable: boolean;
};

const PRIOR_TREATMENT_MESSAGE = 'Complete the prior treatment first.';

export type TreatmentCaseId =
    | 'fc_very_high'
    | 'alk_low'
    | 'ph_low'
    | 'ph_high'
    | 'fc_low'
    | 'bromine_low'
    | 'cc_high'
    | 'alk_very_high'
    | 'alk_high'
    | 'cya_very_high'
    | 'cya_mid'
    | 'cya_low'
    | 'salt_very_high'
    | 'salt_high'
    | 'salt_low';

type TreatmentCase = {
    id: TreatmentCaseId;
    testName: string;
    value: string;
    treatMessage: string;
};

/** "What to do" steps for the active case. Fill these in per treatment. */
export const TREATMENT_STEPS: Record<TreatmentCaseId, TreatmentStep[]> = {
    fc_very_high: [
        {
            id: 'stop-chlorine',
            number: 1,
            icon: 'pill',
            title: 'Stop adding chlorine',
            substeps: [
                'Turn off or reduce the chlorine feeder.',
                'Stop liquid-chlorine dosing.',
                'Set the salt cell to zero/off if applicable.',
                'Remove any temporary chlorine source that can safely be removed according to its instructions.',
            ],
        },
        {
            id: 'keep-circulating',
            number: 2,
            icon: 'wave',
            title: 'Keep the pool circulating',
            substeps: [
                'Run normal filtration/circulation.',
                'Do not add another balancing chemical yet.',
            ],
        },
        {
            id: 'let-chlorine-drop',
            number: 3,
            icon: 'clock',
            title: 'Allow chlorine to decline naturally',
            body: 'Do not routinely add chlorine neutralizer.',
        },
        {
            id: 'retest',
            number: 4,
            icon: 'measure',
            title: 'Retest',
            body: 'Use a high-range chlorine test such as FAS-DPD.',
            substeps: ['Free chlorine'],
        },
    ],
    alk_low: [
        {
            id: 'raise-alkalinity',
            number: 1,
            icon: 'measure',
            title: 'Raise total alkalinity first',
            body: 'Use alkalinity increaser, normally sodium-bicarbonate based.',
        },
        {
            id: 'circulate-alkalinity',
            number: 2,
            icon: 'wave',
            title: 'Circulate.',
        },
        {
            id: 'retest-alkalinity',
            number: 3,
            icon: 'measure',
            title: 'Retest',
            substeps: ['Total alkalinity'],
        },
    ],
    ph_low: [
        {
            id: 'raise-ph',
            number: 1,
            icon: 'dropper',
            title: 'Raise pH',
            body: 'Use the appropriate pH increaser.',
        },
        {
            id: 'circulate-ph',
            number: 2,
            icon: 'wave',
            title: 'Circulate.',
        },
        {
            id: 'retest-ph',
            number: 3,
            icon: 'measure',
            title: 'Retest',
            substeps: ['pH'],
        },
    ],
    ph_high: [
        {
            id: 'lower-ph',
            number: 1,
            icon: 'dropper',
            title: 'Lower pH first',
            body: 'Use the selected pH-decreasing product at its calculated dose.',
        },
        {
            id: 'circulate',
            number: 2,
            icon: 'wave',
            title: 'Circulate.',
        },
        {
            id: 'retest',
            number: 3,
            icon: 'measure',
            title: 'Retest',
            substeps: ['pH'],
        },
    ],
    fc_low: [
        {
            id: 'restore-liquid-chlorine',
            number: 1,
            icon: 'pill',
            title: 'Restore chlorine with liquid chlorine.',
        },
        {
            id: 'circulate-low-chlorine',
            number: 2,
            icon: 'wave',
            title: 'Circulate.',
        },
        {
            id: 'retest-low-chlorine',
            number: 3,
            icon: 'measure',
            title: 'Retest FC.',
        },
        {
            id: 'diagnose-salt-system',
            number: 4,
            icon: 'measure',
            title: 'Diagnose the salt system',
            body: 'Check:',
            substeps: [
                'Salt-cell output percentage',
                'Pump runtime',
                'Flow',
                'Water temperature',
                'Cell scale',
                'Warning/error codes',
                'Cell age/condition',
            ],
        },
        {
            id: 'correct-salt-equipment',
            number: 5,
            icon: 'sparkle',
            title: 'Correct the identified equipment/operation problem.',
        },
    ],
    bromine_low: [],
    cc_high: [
        {
            id: 'confirm-fc-cc-fas-dpd',
            number: 1,
            icon: 'measure',
            title: 'Confirm FC and TC/CC using FAS-DPD.',
        },
        {
            id: 'calculate-confirmed-cc',
            number: 2,
            icon: 'calculator',
            title: 'Calculate confirmed CC.',
        },
        {
            id: 'cc-below-threshold',
            number: 3,
            icon: 'clock',
            title: 'If CC is below the action threshold',
            body: 'Monitor/retest rather than automatically shocking.',
        },
        {
            id: 'cc-above-threshold',
            number: 4,
            icon: 'pill',
            title: 'If CC remains at or above the treatment threshold',
            substeps: [
                'Keep pool closed.',
                'Perform controlled oxidation using an approved chlorine product.',
                'Maintain ventilation for an indoor pool.',
            ],
        },
        {
            id: 'chlorine-return-to-normal',
            number: 5,
            icon: 'wave',
            title: 'Allow chlorine to return to normal.',
        },
        {
            id: 'retest-before-swimming',
            number: 6,
            icon: 'measure',
            title: 'Retest before swimming.',
        },
    ],
    alk_very_high: [],
    alk_high: [],
    cya_very_high: [
        {
            id: 'keep-pool-closed',
            number: 1,
            icon: 'clock',
            title: 'Keep the pool closed.',
        },
        {
            id: 'confirm-cya-accurately',
            number: 2,
            icon: 'measure',
            title: 'Confirm CYA accurately.',
        },
        {
            id: 'calculate-partial-replacement',
            number: 3,
            icon: 'calculator',
            title: 'Calculate partial water replacement.',
        },
        {
            id: 'drain-refill',
            number: 4,
            icon: 'waterDrop',
            title: 'Drain/refill safely.',
        },
        {
            id: 'circulate-after-refill',
            number: 5,
            icon: 'wave',
            title: 'Circulate.',
        },
        {
            id: 'retest-after-refill',
            number: 6,
            icon: 'measure',
            title: 'Retest',
            substeps: ['CYA'],
        },
    ],
    cya_mid: [
        {
            id: 'confirm-cya',
            number: 1,
            icon: 'dropper',
            title: 'Confirm CYA with a more precise test.',
        },
        {
            id: 'avoid-cya-sources',
            number: 2,
            icon: 'pill',
            title: 'Stop or avoid additional CYA sources',
            body: 'Avoid:',
            substeps: ['Trichlor', 'Dichlor', 'Standalone stabilizer'],
        },
        {
            id: 'calculate-dilution',
            number: 3,
            icon: 'calculator',
            title: 'If confirmed CYA requires reduction, calculate partial water replacement.',
        },
        {
            id: 'retest-after-dilution',
            number: 4,
            icon: 'clock',
            title: 'Retest after dilution.',
        },
    ],
    cya_low: [
        {
            id: 'add-stabilizer',
            number: 1,
            icon: 'dropper',
            title: 'Add standalone stabilizer separately.',
        },
        {
            id: 'dissolve-stabilizer',
            number: 2,
            icon: 'wave',
            title: 'Circulate/dissolve according to the product instructions.',
        },
        {
            id: 'retest-cya',
            number: 3,
            icon: 'clock',
            title: 'Retest CYA after the required interval.',
        },
    ],
    salt_very_high: [
        {
            id: 'keep-closed-high-salt',
            number: 1,
            icon: 'clock',
            title: 'Keep pool closed.',
        },
        {
            id: 'confirm-salt-independently',
            number: 2,
            icon: 'measure',
            title: 'Confirm salt independently.',
        },
        {
            id: 'stop-adding-salt',
            number: 3,
            icon: 'pill',
            title: 'Stop adding salt.',
        },
        {
            id: 'arrange-salt-replacement',
            number: 4,
            icon: 'calculator',
            title: 'Arrange partial water replacement.',
        },
        {
            id: 'refill-circulate-high-salt',
            number: 5,
            icon: 'wave',
            title: 'Refill and circulate.',
        },
        {
            id: 'retest-after-high-salt',
            number: 6,
            icon: 'measure',
            title: 'Retest',
            substeps: ['Salt'],
        },
        {
            id: 'verify-salt-generator',
            number: 7,
            icon: 'sparkle',
            title: 'Verify the salt generator operates normally.',
        },
    ],
    salt_high: [
        {
            id: 'salt-high-drain-later',
            number: 1,
            icon: 'pill',
            title: 'If draining is not immediate',
            substeps: [
                'Confirm the high salt result.',
                'Calculate partial water replacement.',
                'Dilute.',
                'Refill/circulate.',
                'Retest salt.',
            ],
        },
        {
            id: 'salt-high-drain-now',
            number: 2,
            icon: 'waterDrop',
            title: 'If draining will start immediately',
            substeps: [
                'Confirm salt.',
                'Dilute first.',
                'Refill and circulate.',
                'Retest salt.',
            ],
        },
    ],
    salt_low: [
        {
            id: 'confirm-salt-target',
            number: 1,
            icon: 'measure',
            title: 'Confirm the salt reading and equipment target.',
        },
        {
            id: 'calculate-salt',
            number: 2,
            icon: 'calculator',
            title: 'Calculate salt addition.',
        },
        {
            id: 'add-pool-salt',
            number: 3,
            icon: 'dropper',
            title: 'Add high-purity pool salt separately.',
        },
        {
            id: 'dissolve-salt',
            number: 4,
            icon: 'wave',
            title: 'Circulate until completely dissolved according to equipment instructions.',
        },
        {
            id: 'retest-salt',
            number: 5,
            icon: 'measure',
            title: 'Retest salt.',
        },
        {
            id: 'resume-salt-cell',
            number: 6,
            icon: 'sparkle',
            title: 'Return salt cell to normal operation.',
        },
    ],
};

/** High pH above 8 with high alkalinity. One acid treatment lowers both. */
const PH_HIGH_WITH_HIGH_ALKALINITY: TreatmentStep[] = [
    {
        id: 'staged-ph-reduction',
        number: 1,
        icon: 'dropper',
        title: 'Begin staged pH reduction',
        body: 'Calculate a conservative pH-reducer dose.',
    },
    {
        id: 'circulate-staged-ph',
        number: 2,
        icon: 'wave',
        title: 'Circulate.',
    },
    {
        id: 'retest-ph-alkalinity',
        number: 3,
        icon: 'measure',
        title: 'Retest',
        substeps: ['pH', 'Total alkalinity'],
    },
    {
        id: 'repeat-if-justified',
        number: 4,
        icon: 'clock',
        title: 'Repeat only if the new results justify another stage.',
    },
];

/** Steps for the winning case. Some cases change when another reading is also off. */
export function stepsForActiveCase(alerts: TreatmentAlert[]): TreatmentStep[] {
    const active = alerts.find((alert) => alert.actionable);
    if (!active) return [];

    const has = (caseId: TreatmentCaseId) => alerts.some((alert) => alert.caseId === caseId);

    if (active.caseId === 'ph_high' && (has('alk_high') || has('alk_very_high'))) {
        return PH_HIGH_WITH_HIGH_ALKALINITY;
    }

    return TREATMENT_STEPS[active.caseId];
}

const CASE_DISPLAY_ORDER: TreatmentCaseId[] = [
    'fc_very_high',
    'alk_low',
    'ph_low',
    'ph_high',
    'fc_low',
    'bromine_low',
    'cc_high',
    'alk_very_high',
    'alk_high',
    'cya_very_high',
    'cya_mid',
    'cya_low',
    'salt_very_high',
    'salt_high',
    'salt_low',
];

function pickFirstCase(ids: Set<TreatmentCaseId>): TreatmentCaseId | null {
    if (ids.has('fc_very_high')) return 'fc_very_high';

    if (ids.has('ph_low') && ids.has('alk_low')) return 'alk_low';
    if (ids.has('ph_low')) return 'ph_low';
    if (ids.has('ph_high')) return 'ph_high';

    if (ids.has('fc_low') && ids.has('salt_very_high')) return 'salt_very_high';

    if (ids.has('fc_low')) return 'fc_low';
    if (ids.has('bromine_low')) return 'bromine_low';

    if (ids.has('cc_high')) return 'cc_high';

    if (ids.has('alk_low')) return 'alk_low';
    if (ids.has('alk_very_high')) return 'alk_very_high';
    if (ids.has('alk_high')) return 'alk_high';

    if (ids.has('cya_very_high')) return 'cya_very_high';
    if (ids.has('cya_mid')) return 'cya_mid';
    if (ids.has('cya_low')) return 'cya_low';

    if (ids.has('salt_very_high')) return 'salt_very_high';
    if (ids.has('salt_high')) return 'salt_high';
    if (ids.has('salt_low')) return 'salt_low';

    return null;
}

function sameSelections(a: Record<string, string>, b: Record<string, string>) {
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every((key) => a[key] === b[key]);
}

/**
 * Prefer the statuses water-results already stored on the provider.
 * Those are an ordered list, so they are used only when they still line up
 * with this saved reading. Otherwise score the saved values with the pool's
 * ideal ranges — the Readings tab opens this screen with no session list.
 */
export function statusesForReading(
    readings: LatestReading | null,
    readingStatus: ReadingStatus[],
    selectedBrand: string | null,
    selections: Record<string, string>,
    pool: Pool | null,
): Record<string, ReadingStatus> {
    const rows = resolvePads(selectedBrand, selections).filter(
        (pad) => selections[pad.testName] != null,
    );
    const saved = readings?.selections;
    if (
        saved &&
        rows.length > 0 &&
        rows.length === readingStatus.length &&
        sameSelections(selections, saved)
    ) {
        return Object.fromEntries(
            rows.map((pad, index) => [pad.testName, readingStatus[index]]),
        );
    }

    const source = saved ?? {};
    const ranges = getIdealStatusRange(source, pool);
    const statuses: Record<string, ReadingStatus> = {};
    for (const [testName, value] of Object.entries(source)) {
        statuses[testName] = getReadingStatus(testName, value, ranges[testName]);
    }
    return statuses;
}

/**
 * Independent case checks, then a ranker picks who is treated first.
 * Deferred cards share one message. Combination overrides live in pickFirstCase.
 */
export function getReadingsThatNeedTreatment(
    readings: LatestReading | null,
    statuses: Record<string, ReadingStatus> = {},
): TreatmentAlert[] {
    const cases: TreatmentCase[] = [];

    const freeChlorine = readings?.selections['Free Chlorine'];
    const ph = readings?.selections['pH'];
    const alkalinity = readings?.selections['Total Alkalinity'];
    const bromine = readings?.selections['Bromine'];
    const cya = readings?.selections['Cyanuric Acid'];
    const salt = readings?.selections['Salt'];
    const combinedChlorine = readings?.selections['Combined Chlorine'];
    const alkStatus = statuses['Total Alkalinity'] ?? null;
    const inBand = (testName: string, bands: ReadingStatus[]) => {
        const status = statuses?.[testName];
        return status != null && bands.includes(status);
    };

    if (freeChlorine && Number(freeChlorine) >= 10) {
        cases.push({
            id: 'fc_very_high',
            testName: 'Free Chlorine',
            value: freeChlorine,
            treatMessage:
                'Free chlorine is very high. Stop adding chlorine and avoid swimming until it drops back into range.',
        });
    }
    if (
        freeChlorine &&
        inBand('Free Chlorine', ['low', 'very_low'])
    ) {
        cases.push({
            id: 'fc_low',
            testName: 'Free Chlorine',
            value: freeChlorine,
            treatMessage: 'Sanitizer is low. Add chlorine to bring it back into range, then retest.',
        });
    }
    if (ph && Number(ph) > 8.0) {
        cases.push({
            id: 'ph_high',
            testName: 'pH',
            value: ph,
            treatMessage:
                alkStatus === 'high' || alkStatus === 'very_high'
                    ? 'pH and Alkalinity are too high. Lower pH only — alkalinity will come down as pH drops.'
                    : 'pH is too high. Lower pH first.',
        });
    }
    if (ph && Number(ph) < 7.0) {
        cases.push({
            id: 'ph_low',
            testName: 'pH',
            value: ph,
            treatMessage:
                'pH is too low. Raise pH first — chlorine will not sanitize well until pH is back in range.',
        });
    }
    if (alkalinity && Number(alkalinity) < 80) {
        cases.push({
            id: 'alk_low',
            testName: 'Total Alkalinity',
            value: alkalinity,
            treatMessage: 'Alkalinity is below 80 ppm. Raise alkalinity first, then retest.',
        });
    }
    if (alkalinity && alkStatus === 'high') {
        cases.push({
            id: 'alk_high',
            testName: 'Total Alkalinity',
            value: alkalinity,
            treatMessage: 'Alkalinity is high. Lower alkalinity to bring it back into range, then retest.',
        });
    }
    if (alkalinity && alkStatus === 'very_high') {
        cases.push({
            id: 'alk_very_high',
            testName: 'Total Alkalinity',
            value: alkalinity,
            treatMessage: 'Alkalinity is very high. Lower alkalinity to bring it back into range, then retest.',
        });
    }
    if (bromine && inBand('Bromine', ['low', 'very_low'])) {
        cases.push({
            id: 'bromine_low',
            testName: 'Bromine',
            value: bromine,
            treatMessage: 'Bromine is low. Add bromine to bring it back into range, then retest.',
        });
    }
    if (cya && inBand('Cyanuric Acid', ['low', 'very_low'])) {
        cases.push({
            id: 'cya_low',
            testName: 'Cyanuric Acid',
            value: cya,
            treatMessage: 'Cyanuric acid is low. Add cyanuric acid to bring it back into range, then retest.',
        });
    }
    if (cya && Number(cya) >= 51 && Number(cya) < 150) {
        cases.push({
            id: 'cya_mid',
            testName: 'Cyanuric Acid',
            value: cya,
            treatMessage:
                'Cyanuric acid is high. Remove cyanuric acid to bring it back into range, then retest.',
        });
    }
    if (cya && Number(cya) >= 150) {
        cases.push({
            id: 'cya_very_high',
            testName: 'Cyanuric Acid',
            value: cya,
            treatMessage:
                'Cyanuric acid is too high. Remove cyanuric acid first — chlorine will not sanitize well until CYA is back in range.',
        });
    }
    if (salt && inBand('Salt', ['low', 'very_low'])) {
        cases.push({
            id: 'salt_low',
            testName: 'Salt',
            value: salt,
            treatMessage: 'Salt is low. Add salt to bring it back into range, then retest.',
        });
    }
    if (salt && Number(salt) >= 4501 && Number(salt) <= 5999) {
        cases.push({
            id: 'salt_high',
            testName: 'Salt',
            value: salt,
            treatMessage: 'Salt is too high. Remove salt to bring it back into range, then retest.',
        });
    }
    if (salt && Number(salt) >= 6000) {
        cases.push({
            id: 'salt_very_high',
            testName: 'Salt',
            value: salt,
            treatMessage:
                'Salt is too high. Remove salt first — chlorine will not sanitize well until salt is back in range.',
        });
    }
    if (
        combinedChlorine &&
        inBand('Combined Chlorine', ['high', 'very_high'])
    ) {
        cases.push({
            id: 'cc_high',
            testName: 'Combined Chlorine',
            value: combinedChlorine,
            treatMessage: 'Combined chlorine is high. Bring it back into range, then retest.',
        });
    }

    const firstId = pickFirstCase(new Set(cases.map((item) => item.id)));
    if (!firstId) return [];

    const first = cases.find((item) => item.id === firstId);
    if (!first) return [];

    const rest = cases
        .filter((item) => item.id !== firstId)
        .sort(
            (a, b) => CASE_DISPLAY_ORDER.indexOf(a.id) - CASE_DISPLAY_ORDER.indexOf(b.id),
        );

    const veryHighSalt =
        first.id === 'salt_very_high' && cases.some((item) => item.id === 'fc_low');

    return [
        {
            caseId: first.id,
            testName: first.testName,
            value: first.value,
            actionable: true,
            message: veryHighSalt
                ? 'Salt is 6,000 ppm or higher and chlorine is low. Replace water before restoring chlorine.'
                : first.treatMessage,
        },
        ...rest.map((item) => ({
            caseId: item.id,
            testName: item.testName,
            value: item.value,
            actionable: false,
            message: PRIOR_TREATMENT_MESSAGE,
        })),
    ];
}


/**
 * Nested else-if implementation — kept for reference, not called.
 */
// export function getReadingsThatNeedTreatment(readings: LatestReading | null): TreatmentAlert[] {
//     const alerts: TreatmentAlert[] = [];

//     const freeChlorine = readings?.selections['Free Chlorine'];
//     const ph = readings?.selections['pH'];
//     const alkalinity = readings?.selections['Total Alkalinity'];
//     const bromine = readings?.selections['Bromine'];
//     const cya = readings?.selections['Cyanuric Acid'];
//     const salt = readings?.selections['Salt'];
//     const combinedChlorine = readings?.selections['Combined Chlorine'];
//     const calciumHardness = readings?.selections['Calcium Hardness'];

//     const sanitizerLow =
//         !!freeChlorine &&
//         ['low', 'very_low'].includes(getReadingStatus('Free Chlorine', freeChlorine));

//     const bromineLow =
//         !!bromine &&
//         ['low', 'very_low'].includes(getReadingStatus('Bromine', bromine));

//     const cyaLow =
//         !!cya &&
//         ['low', 'very_low'].includes(getReadingStatus('Cyanuric Acid', cya));

//     const saltLow =
//         !!salt &&
//         ['low', 'very_low'].includes(getReadingStatus('Salt', salt));
//     const saltHigh =
//         !!salt &&
//         Number(salt) >= 4501 &&
//         Number(salt) <= 5999;
//     const saltVeryHigh = !!salt && Number(salt) >= 6000;

//     const combinedChlorineHigh =
//         !!combinedChlorine &&
//         ['high', 'very_high'].includes(getReadingStatus('Combined Chlorine', combinedChlorine));

//     const calciumHardnessLow =
//         !!calciumHardness &&
//         ['low', 'very_low'].includes(getReadingStatus('Calcium Hardness', calciumHardness));

//     if (freeChlorine && Number(freeChlorine) >= 10) {
//         alerts.push({
//             testName: 'Free Chlorine',
//             value: freeChlorine,
//             actionable: true,
//             message: 'Free chlorine is very high. Stop adding chlorine and avoid swimming until it drops back into range.',
//         });
//         if (ph && Number(ph) >= 8.0) {
//             alerts.push({
//                 testName: 'pH',
//                 value: ph,
//                 actionable: false,
//                 message: "pH can't be treated reliably right now — extremely high chlorine can throw off the reading. Recheck pH after chlorine is back in range.",
//             });
//         }
//     }
//     else if (ph && Number(ph) > 8.0) {
//         alerts.push({
//             testName: 'pH',
//             value: ph,
//             actionable: true,
//             message:
//                 alkalinity && Number(alkalinity) > 120
//                     ? 'pH and Alkalinity are too high. Lower pH only — alkalinity will come down as pH drops.'
//                     : 'pH is too high. Lower pH first.',
//         });
//         if (sanitizerLow) {
//             alerts.push({
//                 testName: 'Free Chlorine',
//                 value: freeChlorine!,
//                 actionable: false,
//                 message: 'Sanitizer is low. Restore chlorine after you retest, once pH has been lowered.',
//             });
//         }
//     }
//     else if (ph && Number(ph) < 7.0) {
//         if (alkalinity && Number(alkalinity) < 80) {
//             alerts.push({
//                 testName: 'Total Alkalinity',
//                 value: alkalinity,
//                 actionable: true,
//                 message: 'Alkalinity is too low. Raise alkalinity first — pH will not hold until alkalinity is back in range.',
//             });
//             alerts.push({
//                 testName: 'pH',
//                 value: ph,
//                 actionable: false,
//                 message: 'pH is too low. Retest pH after alkalinity has been raised.',
//             });
//             if (sanitizerLow) {
//                 alerts.push({
//                     testName: 'Free Chlorine',
//                     value: freeChlorine!,
//                     actionable: false,
//                     message: 'Sanitizer is low. Restore chlorine after you retest, once alkalinity and pH have been corrected.',
//                 });
//             }
//             if (combinedChlorineHigh) {
//                 alerts.push({
//                     testName: 'Combined Chlorine',
//                     value: combinedChlorine!,
//                     actionable: false,
//                     message: 'Combined chlorine is high. Treat it after alkalinity and pH have been corrected.',
//                 });
//             }
//         } else {
//             alerts.push({
//                 testName: 'pH',
//                 value: ph,
//                 actionable: true,
//                 message: 'pH is too low. Raise pH first — chlorine will not sanitize well until pH is back in range.',
//             });
//             if (sanitizerLow) {
//                 alerts.push({
//                     testName: 'Free Chlorine',
//                     value: freeChlorine!,
//                     actionable: false,
//                     message: 'Sanitizer is low. Restore chlorine after you retest, once pH has been corrected.',
//                 });
//             }
//             if (combinedChlorineHigh) {
//                 alerts.push({
//                     testName: 'Combined Chlorine',
//                     value: combinedChlorine!,
//                     actionable: false,
//                     message: 'Combined chlorine is high. Treat it after pH has been raised.',
//                 });
//             }
//         }
//     }
//     else if (sanitizerLow) {
//         if (cya && Number(cya) >= 150) {
//             alerts.push({
//                 testName: 'Cyanuric Acid',
//                 value: cya,
//                 actionable: true,
//                 message: 'Cyanuric acid is too high. Remove cyanuric acid first — chlorine will not sanitize well until CYA is back in range.',
//             });
//             alerts.push({
//                 testName: 'Free Chlorine',
//                 value: freeChlorine!,
//                 actionable: false,
//                 message: 'Sanitizer is low. Restore chlorine after you retest, once cyanuric acid has been lowered.',
//             });
//         } else if (saltVeryHigh) {
//             alerts.push({
//                 testName: 'Salt',
//                 value: salt!,
//                 actionable: true,
//                 message: 'Salt is too high. Remove salt first — chlorine will not sanitize well until salt is back in range.',
//             });
//             alerts.push({
//                 testName: 'Free Chlorine',
//                 value: freeChlorine!,
//                 actionable: false,
//                 message: 'Sanitizer is low. Restore chlorine after you retest, once salt has been lowered.',
//             });
//         } else {
//             alerts.push({
//                 testName: 'Free Chlorine',
//                 value: freeChlorine!,
//                 actionable: true,
//                 message: 'Sanitizer is low. Add chlorine to bring it back into range, then retest.',
//             });
//         }
//         if (cyaLow) {
//             alerts.push({
//                 testName: 'Cyanuric Acid',
//                 value: cya,
//                 actionable: false,
//                 message: saltVeryHigh
//                     ? 'bring salt back into range first, then chlorine. Then, add cyanuric acid to bring it back into range, then retest.'
//                     : 'bring Chlorine back into range first. Then, add cyanuric acid to bring it back into range, then retest.',
//             });
//         }
//         if (cya && Number(cya) >= 51 && Number(cya) < 150) {
//             alerts.push({
//                 testName: 'Cyanuric Acid',
//                 value: cya,
//                 actionable: false,
//                 message: saltVeryHigh
//                     ? 'bring salt back into range first, then chlorine. Then, remove cyanuric acid to bring it back into range, then retest.'
//                     : 'bring Chlorine back into range first. Then, remove cyanuric acid to bring it back into range, then retest.',
//             });
//         }
//         if (saltLow || saltHigh) {
//             const saltAction = saltHigh ? 'remove' : 'add';
//             alerts.push({
//                 testName: 'Salt',
//                 value: salt!,
//                 actionable: false,
//                 message:
//                     cya && Number(cya) >= 150
//                         ? `bring Cyanuric acid back into range first, then chlorine. Then, ${saltAction} salt to bring it back into range, then retest.`
//                         : `bring Chlorine back into range first. Then, ${saltAction} salt to bring it back into range, then retest.`,
//             });
//         }
//         if (saltVeryHigh && cya && Number(cya) >= 150) {
//             alerts.push({
//                 testName: 'Salt',
//                 value: salt!,
//                 actionable: false,
//                 message: 'bring Cyanuric acid back into range first, then chlorine. Then, remove salt to bring it back into range, then retest.',
//             });
//         }
//     }
//     else if (alkalinity && Number(alkalinity) < 80) {
//         alerts.push({
//             testName: 'Total Alkalinity',
//             value: alkalinity,
//             actionable: true,
//             message: 'Alkalinity is below 80 ppm. Raise alkalinity first, then retest.',
//         });
//     }
//     else if (bromineLow) {
//         alerts.push({
//             testName: 'Bromine',
//             value: bromine!,
//             actionable: true,
//             message: 'Bromine is low. Add bromine to bring it back into range, then retest.',
//         });
//     }
//     else if (combinedChlorineHigh) {
//         alerts.push({
//             testName: 'Combined Chlorine',
//             value: combinedChlorine!,
//             actionable: true,
//             message: 'Combined chlorine is high. Treat it after alkalinity and pH have been corrected.',
//         });
//     }
//     else if (calciumHardnessLow){
        
//     }
//     return alerts;
// }

