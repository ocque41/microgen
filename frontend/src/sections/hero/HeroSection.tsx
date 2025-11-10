import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./hero.css";

const MS_IN_DAY = 24 * 60 * 60 * 1000;
const MIN_COUNTER_DIGITS = 2;

const formatDayCounter = (days: number) => {
  const digits = Math.max(MIN_COUNTER_DIGITS, days.toString().length);
  return `+${days.toString().padStart(digits, "0")}`;
};

const resolveCounterStart = () => {
  const envValue = import.meta.env.VITE_HERO_COUNTER_START;

  if (typeof envValue === "string" && envValue.trim().length > 0) {
    const asNumber = Number(envValue);
    if (!Number.isNaN(asNumber)) {
      return asNumber;
    }

    const parsed = Date.parse(envValue);
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }

  return Date.now();
};

const useDailyCounter = (explicitStart?: number) => {
  const [start] = useState(() => explicitStart ?? resolveCounterStart());
  const calculateDays = useCallback(() => {
    return Math.max(0, Math.floor((Date.now() - start) / MS_IN_DAY));
  }, [start]);

  const [daysElapsed, setDaysElapsed] = useState(() => calculateDays());

  useEffect(() => {
    const interval = setInterval(() => {
      setDaysElapsed(calculateDays());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [calculateDays]);

  return daysElapsed;
};

const useLoop = (delay = 2200) => {
  const [key, setKey] = useState(0);

  const incrementKey = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const interval = setInterval(incrementKey, delay);
    return () => clearInterval(interval);
  }, [delay, incrementKey]);

  return { key };
};

const AnimatedWord = ({ words }: { words: string[] }) => {
  const { key } = useLoop();
  const longestWord = useMemo(() => {
    return words.reduce((longest, word) => {
      return word.length > longest.length ? word : longest;
    }, words[0] ?? "");
  }, [words]);

  const currentWord = useMemo(() => {
    return words[key % words.length];
  }, [key, words]);

  return (
    <span
      className="hero__animated-word"
      aria-live="polite"
      style={{ width: `${Math.max(longestWord.length, 1) + 1}ch` }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={key}
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.35 }}
        >
          {currentWord}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export function HeroSection() {
  const daysElapsed = useDailyCounter();
  const animatedTerms = useMemo(
    () => ["BPMNs", "Workflows", "Frameworks", "Pipelines", "Playbooks"],
    [],
  );

  return (
    <section className="hero" data-hero-section>
      <div className="hero__content">
        <header className="hero__header">
          <img
            className="hero__insignia"
            src="/logo-hero-4.png"
            alt="Microagents insignia"
            loading="lazy"
          />
          <h1 className="hero__headline">
            <span className="hero__headline-emphasis hero__headline-counter" aria-label="Operational days counter">
              <span className="hero__counter-plus">+</span>
              <span className="hero__counter-value">{formatDayCounter(daysElapsed).slice(1)}</span>
            </span>
          </h1>
          <p className="hero__subline">
            <AnimatedWord words={animatedTerms} />
            <span className="hero__subline-static">automated</span>
          </p>
          <h2 className="hero__tagline">MICROAGENTS</h2>
          <p className="hero__description">
            A monochrome canvas keeps the interface steady while your automations carry the detail.
            Scroll to fold through real teams, from kickoff canvas to audit trail, all built on the same
            black-and-white surface.
          </p>
        </header>
      </div>
    </section>
  );
}
