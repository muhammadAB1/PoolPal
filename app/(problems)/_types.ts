import type { ImageSourcePropType } from 'react-native';

export type ProblemOption = {
    id: string;
    labelKey: string;
    descriptionKey?: string;
    /** Omit for text-only steps (see the second question onward). */
    image?: ImageSourcePropType;
};

export type QuestionPage = {
    id: string;
    titleKey: string;
    subtitleKey?: string;
    /** When true, the user can select more than one option on this page. */
    multiple: boolean;
    options: ProblemOption[];
};

export type NextAction =
    | { type: 'question'; page: string }
    | { type: 'treatment' };

export type Warning = {
    titleKey: string;
    subtitleKey: string;
};
