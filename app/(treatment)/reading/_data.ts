/**
 * Hardcoded content for the Treatment Plan screen (low pH scenario).
 *
 * Every visible string on `plan.tsx` lives here as plain text — not i18n
 * keys — so this object can later be swapped for content fetched from the
 * database without touching the screen. Icon keys and colors are plain
 * strings/hex values for the same reason; `plan.tsx` maps `TreatmentIconKey`
 * to the actual icon library.
 */

import { getReadingStatus } from '@/data/readingBands';
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
    body: string;
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
    testName: string;
    value: string;
    message: string;
    /** false when a higher-priority reading makes this one unsafe/unreliable to treat right now. */
    actionable: boolean;
};

/**
 * Standalone checks first (same shape as very high chlorine). Combined
 * rules nest inside those branches.
 */
export function getReadingsThatNeedTreatment(readings: LatestReading | null): TreatmentAlert[] {
    const alerts: TreatmentAlert[] = [];

    const freeChlorine = readings?.selections['Free Chlorine'];
    const ph = readings?.selections['pH'];
    const alkalinity = readings?.selections['Total Alkalinity'];
    const bromine = readings?.selections['Bromine'];
    const cya = readings?.selections['Cyanuric Acid'];
    const salt = readings?.selections['Salt'];
    const combinedChlorine = readings?.selections['Combined Chlorine'];
    const calciumHardness = readings?.selections['Calcium Hardness'];

    const sanitizerLow =
        !!freeChlorine &&
        ['low', 'very_low'].includes(getReadingStatus('Free Chlorine', freeChlorine));

    const bromineLow =
        !!bromine &&
        ['low', 'very_low'].includes(getReadingStatus('Bromine', bromine));

    const cyaLow =
        !!cya &&
        ['low', 'very_low'].includes(getReadingStatus('Cyanuric Acid', cya));

    const saltLow =
        !!salt &&
        ['low', 'very_low'].includes(getReadingStatus('Salt', salt));
    const saltHigh =
        !!salt &&
        Number(salt) >= 4501 &&
        Number(salt) <= 5999;
    const saltVeryHigh = !!salt && Number(salt) >= 6000;

    const combinedChlorineHigh =
        !!combinedChlorine &&
        ['high', 'very_high'].includes(getReadingStatus('Combined Chlorine', combinedChlorine));

    const calciumHardnessLow =
        !!calciumHardness &&
        ['low', 'very_low'].includes(getReadingStatus('Calcium Hardness', calciumHardness));

    if (freeChlorine && Number(freeChlorine) >= 10) {
        alerts.push({
            testName: 'Free Chlorine',
            value: freeChlorine,
            actionable: true,
            message: 'Free chlorine is very high. Stop adding chlorine and avoid swimming until it drops back into range.',
        });
        if (ph && Number(ph) >= 8.0) {
            alerts.push({
                testName: 'pH',
                value: ph,
                actionable: false,
                message: "pH can't be treated reliably right now — extremely high chlorine can throw off the reading. Recheck pH after chlorine is back in range.",
            });
        }
    }
    else if (ph && Number(ph) > 8.0) {
        alerts.push({
            testName: 'pH',
            value: ph,
            actionable: true,
            message:
                alkalinity && Number(alkalinity) > 120
                    ? 'pH and Alkalinity are too high. Lower pH only — alkalinity will come down as pH drops.'
                    : 'pH is too high. Lower pH first.',
        });
        if (sanitizerLow) {
            alerts.push({
                testName: 'Free Chlorine',
                value: freeChlorine!,
                actionable: false,
                message: 'Sanitizer is low. Restore chlorine after you retest, once pH has been lowered.',
            });
        }
    }
    else if (ph && Number(ph) < 7.0) {
        if (alkalinity && Number(alkalinity) < 80) {
            alerts.push({
                testName: 'Total Alkalinity',
                value: alkalinity,
                actionable: true,
                message: 'Alkalinity is too low. Raise alkalinity first — pH will not hold until alkalinity is back in range.',
            });
            alerts.push({
                testName: 'pH',
                value: ph,
                actionable: false,
                message: 'pH is too low. Retest pH after alkalinity has been raised.',
            });
            if (sanitizerLow) {
                alerts.push({
                    testName: 'Free Chlorine',
                    value: freeChlorine!,
                    actionable: false,
                    message: 'Sanitizer is low. Restore chlorine after you retest, once alkalinity and pH have been corrected.',
                });
            }
            if (combinedChlorineHigh) {
                alerts.push({
                    testName: 'Combined Chlorine',
                    value: combinedChlorine!,
                    actionable: false,
                    message: 'Combined chlorine is high. Treat it after alkalinity and pH have been corrected.',
                });
            }
        } else {
            alerts.push({
                testName: 'pH',
                value: ph,
                actionable: true,
                message: 'pH is too low. Raise pH first — chlorine will not sanitize well until pH is back in range.',
            });
            if (sanitizerLow) {
                alerts.push({
                    testName: 'Free Chlorine',
                    value: freeChlorine!,
                    actionable: false,
                    message: 'Sanitizer is low. Restore chlorine after you retest, once pH has been corrected.',
                });
            }
            if (combinedChlorineHigh) {
                alerts.push({
                    testName: 'Combined Chlorine',
                    value: combinedChlorine!,
                    actionable: false,
                    message: 'Combined chlorine is high. Treat it after pH has been raised.',
                });
            }
        }
    }
    else if (sanitizerLow) {
        if (cya && Number(cya) >= 150) {
            alerts.push({
                testName: 'Cyanuric Acid',
                value: cya,
                actionable: true,
                message: 'Cyanuric acid is too high. Remove cyanuric acid first — chlorine will not sanitize well until CYA is back in range.',
            });
            alerts.push({
                testName: 'Free Chlorine',
                value: freeChlorine!,
                actionable: false,
                message: 'Sanitizer is low. Restore chlorine after you retest, once cyanuric acid has been lowered.',
            });
        } else if (saltVeryHigh) {
            alerts.push({
                testName: 'Salt',
                value: salt!,
                actionable: true,
                message: 'Salt is too high. Remove salt first — chlorine will not sanitize well until salt is back in range.',
            });
            alerts.push({
                testName: 'Free Chlorine',
                value: freeChlorine!,
                actionable: false,
                message: 'Sanitizer is low. Restore chlorine after you retest, once salt has been lowered.',
            });
        } else {
            alerts.push({
                testName: 'Free Chlorine',
                value: freeChlorine!,
                actionable: true,
                message: 'Sanitizer is low. Add chlorine to bring it back into range, then retest.',
            });
        }
        if (cyaLow) {
            alerts.push({
                testName: 'Cyanuric Acid',
                value: cya,
                actionable: false,
                message: saltVeryHigh
                    ? 'bring salt back into range first, then chlorine. Then, add cyanuric acid to bring it back into range, then retest.'
                    : 'bring Chlorine back into range first. Then, add cyanuric acid to bring it back into range, then retest.',
            });
        }
        if (cya && Number(cya) >= 51 && Number(cya) < 150) {
            alerts.push({
                testName: 'Cyanuric Acid',
                value: cya,
                actionable: false,
                message: saltVeryHigh
                    ? 'bring salt back into range first, then chlorine. Then, remove cyanuric acid to bring it back into range, then retest.'
                    : 'bring Chlorine back into range first. Then, remove cyanuric acid to bring it back into range, then retest.',
            });
        }
        if (saltLow || saltHigh) {
            const saltAction = saltHigh ? 'remove' : 'add';
            alerts.push({
                testName: 'Salt',
                value: salt!,
                actionable: false,
                message:
                    cya && Number(cya) >= 150
                        ? `bring Cyanuric acid back into range first, then chlorine. Then, ${saltAction} salt to bring it back into range, then retest.`
                        : `bring Chlorine back into range first. Then, ${saltAction} salt to bring it back into range, then retest.`,
            });
        }
        if (saltVeryHigh && cya && Number(cya) >= 150) {
            alerts.push({
                testName: 'Salt',
                value: salt!,
                actionable: false,
                message: 'bring Cyanuric acid back into range first, then chlorine. Then, remove salt to bring it back into range, then retest.',
            });
        }
    }
    else if (alkalinity && Number(alkalinity) < 80) {
        alerts.push({
            testName: 'Total Alkalinity',
            value: alkalinity,
            actionable: true,
            message: 'Alkalinity is below 80 ppm. Raise alkalinity first, then retest.',
        });
    }
    else if (bromineLow) {
        alerts.push({
            testName: 'Bromine',
            value: bromine!,
            actionable: true,
            message: 'Bromine is low. Add bromine to bring it back into range, then retest.',
        });
    }
    else if (combinedChlorineHigh) {
        alerts.push({
            testName: 'Combined Chlorine',
            value: combinedChlorine!,
            actionable: true,
            message: 'Combined chlorine is high. Treat it after alkalinity and pH have been corrected.',
        });
    }
    else if (calciumHardnessLow){
        
    }
    return alerts;
}
