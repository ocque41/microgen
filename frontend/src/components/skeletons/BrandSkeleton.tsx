import "../../styles/brand-preview.css";

export function BrandSkeleton() {
  const surfacePlaceholders = ["surface-a", "surface-b", "surface-c"];
  const contrastPlaceholders = ["contrast-a", "contrast-b", "contrast-c"];

  return (
    <div className="brand-page">
      <div className="brand-page__container animate-pulse">
        <div className="brand-section">
          <div className="h-3 w-32 rounded-md" style={{ background: "var(--brand-color-surface-muted)" }} />
          <div className="h-10 w-2/3 rounded-lg" style={{ background: "var(--brand-color-surface)" }} />
          <div className="h-6 w-full rounded-md" style={{ background: "var(--brand-color-surface-muted)" }} />
        </div>
        <div className="brand-section">
          <div className="h-9 w-40 rounded-md" style={{ background: "var(--brand-color-surface)" }} />
          <div className="grid brand-grid md:grid-cols-3">
            {surfacePlaceholders.map((key) => (
              <div
                key={key}
                className="brand-surface-card"
                style={{
                  background: "var(--brand-color-surface)",
                  color: "var(--brand-color-text)",
                  minHeight: "12rem",
                }}
              />
            ))}
          </div>
        </div>
        <div className="brand-section">
          <div className="h-9 w-48 rounded-md" style={{ background: "var(--brand-color-surface)" }} />
          <div className="grid brand-grid md:grid-cols-3">
            {contrastPlaceholders.map((key) => (
              <div
                key={key}
                className="brand-contrast-card"
                style={{
                  background: "var(--glass-bg)",
                  color: "var(--brand-color-text)",
                  minHeight: "10rem",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
