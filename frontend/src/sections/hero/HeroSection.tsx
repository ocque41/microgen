import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import "./hero.css";

const MS_IN_DAY = 24 * 60 * 60 * 1000;
// Freeze the hero counter to the launch day so it advances globally, not per visitor session.
const HERO_COUNTER_START = new Date("2024-06-03T00:00:00Z").getTime();
const MIN_COUNTER_DIGITS = 2;

const formatDayCounter = (days: number) => {
  const digits = Math.max(MIN_COUNTER_DIGITS, days.toString().length);
  return `+${days.toString().padStart(digits, "0")}`;
};

const useDailyCounter = (start: number) => {
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

  const currentWord = useMemo(() => {
    return words[key % words.length];
  }, [key, words]);

  return (
    <span className="hero__animated-word" aria-live="polite">
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
  const daysElapsed = useDailyCounter(HERO_COUNTER_START);
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
            <span className="hero__headline-emphasis hero__headline-counter">
              {formatDayCounter(daysElapsed)}
            </span>
            clarity, without the glow
          </h1>
          <p className="hero__subline">
            <AnimatedWord words={animatedTerms} />
            <span className="hero__subline-static">automated</span>
          </p>
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
