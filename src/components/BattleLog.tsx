type BattleLogProps = {
  log: string[];
};

export function BattleLog({ log }: BattleLogProps) {
  const latestEntries = log.slice(-10);

  return (
    <section className="battle-panel battle-log">
      <h3>Battle Log</h3>

      <div className="battle-log-entries">
        {latestEntries.map((entry, index) => (
          <p key={`${entry}-${index}`}>{entry}</p>
        ))}
      </div>
    </section>
  );
}