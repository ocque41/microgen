import { ChevronRight } from "lucide-react";

import type { FactRecord } from "../lib/facts";

export function FactCard({ fact }: { fact: FactRecord }) {
  return (
    <li className="group flex items-start gap-1 text-sm font-medium text-text-muted">
      <ChevronRight className="h-5 w-5 text-text" />
      {fact.text}
    </li>
  );
}
