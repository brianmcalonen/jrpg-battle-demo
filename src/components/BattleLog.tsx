type BattleLogProps = {
  log: string[];
};

export function BattleLog({ log }: BattleLogProps) {
  return (
    <section>
      <h3>Battle Log</h3>

      {log.map((entry, index) => (
        <p key={index}>{entry}</p>
      ))}
    </section>
  );
}