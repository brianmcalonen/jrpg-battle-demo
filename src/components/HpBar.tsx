type HpBarProps = {
  current: number;
  max: number;
};

export function HpBar({ current, max }: HpBarProps) {
  const percentage = Math.max(0, (current / max) * 100);

  return (
    <div style={{ width: "100%", background: "#440000", height: 16 }}>
      <div
        style={{
          width: `${percentage}%`,
          background: "#19c463",
          height: "100%",
          transition: "width 0.2s ease",
        }}
      />
    </div>
  );
}