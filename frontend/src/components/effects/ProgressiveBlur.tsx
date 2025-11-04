import { memo } from "react";
import { cn } from "../../lib/utils";

type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
  strategy?: "absolute" | "fixed" | "sticky";
  offset?: string;
};

function ProgressiveBlurComponent({
  className = "",
  backgroundColor = "rgba(9, 9, 9, 0.96)",
  position = "bottom",
  height = "160px",
  blurAmount = "14px",
  strategy = "fixed",
  offset,
}: ProgressiveBlurProps) {
  const isTop = position === "top";
  const positionKey = isTop ? "top" : "bottom";

  const placementStyles: Record<string, string | undefined> = {
    [positionKey]: offset ?? "0",
    height,
    background: isTop
      ? `linear-gradient(to top, transparent, ${backgroundColor})`
      : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
    maskImage: isTop
      ? `linear-gradient(to bottom, ${backgroundColor} 48%, transparent)`
      : `linear-gradient(to top, ${backgroundColor} 48%, transparent)`,
    WebkitBackdropFilter: `blur(${blurAmount})`,
    backdropFilter: `blur(${blurAmount})`,
    WebkitUserSelect: "none",
    userSelect: "none",
  };

  return (
    <div
      className={cn(
        "pointer-events-none left-0 w-full select-none",
        strategy === "fixed" && "fixed",
        strategy === "absolute" && "absolute",
        strategy === "sticky" && "sticky",
        className,
      )}
      style={placementStyles}
      aria-hidden="true"
      data-progressive-blur={position}
    />
  );
}

const ProgressiveBlur = memo(ProgressiveBlurComponent);

export { ProgressiveBlur };
export type { ProgressiveBlurProps };
