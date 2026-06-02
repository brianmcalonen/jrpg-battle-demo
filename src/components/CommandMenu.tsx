type CommandMenuProps = {
  isBattleOver: boolean;
  canUsePowerStrike: boolean;
  onAttack: () => void;
  onPowerStrike: () => void;
  onRestart: () => void;
};

export function CommandMenu({
  isBattleOver,
  canUsePowerStrike,
  onAttack,
  onPowerStrike,
  onRestart,
}: CommandMenuProps) {
  if (isBattleOver) {
    return <button onClick={onRestart}>Restart Battle</button>;
  }

  return (
    <section>
      <button onClick={onAttack}>Attack</button>

      <button onClick={onPowerStrike} disabled={!canUsePowerStrike}>
        Power Strike - 5 MP
      </button>
    </section>
  );
}