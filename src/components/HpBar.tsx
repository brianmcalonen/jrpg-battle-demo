type HpBarProps = {
  current: number;
  max: number;
  variant?: "hp" | "mp";
};

export function HpBar({ current, max, variant = "hp" }: HpBarProps) {
  const percentage = Math.max(0, (current / max) * 100);

  return (
    <div className={`${variant}-bar stat-bar`}>
      <div
        className={`${variant}-fill stat-fill`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}