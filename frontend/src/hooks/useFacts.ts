import { useCallback, useEffect, useState } from "react";

import type { FactRecord } from "../lib/facts";
import { FACTS_STORAGE_KEY } from "../lib/facts";

export type FactAction = {
  type: "save" | "discard";
  factId: string;
  factText?: string;
};

export function useFacts(initialFacts: FactRecord[] = []) {
  const [facts, setFacts] = useState<FactRecord[]>(() => [...initialFacts]);
  const [error] = useState<string | null>(null);
  const loading = false;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.sessionStorage.setItem(FACTS_STORAGE_KEY, JSON.stringify(facts));
    } catch (storageError) {
      if (import.meta.env.DEV) {
        console.warn("[useFacts] Failed to persist facts", storageError);
      }
    }
  }, [facts]);

  const performAction = useCallback(async (action: FactAction) => {
    setFacts((current) => {
      if (action.type === "save") {
        const text = (action.factText ?? "").trim();
        if (!text) {
          return current;
        }
        if (current.some((fact) => fact.id === action.factId)) {
          return current;
        }
        const saved: FactRecord = {
          id: action.factId,
          text,
          status: "saved",
          createdAt: new Date().toISOString(),
        };
        return [...current, saved];
      }

      return current.filter((fact) => fact.id !== action.factId);
    });
  }, []);

  const refresh = useCallback(() => {
    /* no-op: facts are stored in-memory */
  }, []);

  return { facts, loading, error, refresh, performAction };
}
