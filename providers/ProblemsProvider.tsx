import { createContext, useContext, useState, type ReactNode } from 'react';

/** In-memory answers for one Solve Visible Problems session (not persisted). */
type ProblemsContextValue = {
    answers: Record<string, string[]>;
    setAnswer: (page: string, optionIds: string[]) => void;
};

const ProblemsContext = createContext<ProblemsContextValue | undefined>(undefined);

export function ProblemsProvider({ children }: { children: ReactNode }) {
    const [answers, setAnswers] = useState<Record<string, string[]>>({});

    function setAnswer(page: string, optionIds: string[]) {
        setAnswers((prev) => ({ ...prev, [page]: optionIds }));
    }

    return (
        <ProblemsContext.Provider value={{ answers, setAnswer }}>
            {children}
        </ProblemsContext.Provider>
    );
}

export function useProblems() {
    const ctx = useContext(ProblemsContext);
    if (!ctx) throw new Error('useProblems must be used within ProblemsProvider');
    return ctx;
}
