type CommandMenuProps = {
  isBattleOver: boolean;
  canUsePowerStrike: boolean;
  onAttack: () => void;
  onPowerStrike: () => void;
  onDefend: () => void;
};

export function CommandMenu({
  isBattleOver,
  canUsePowerStrike,
  onAttack,
  onPowerStrike,
  onDefend,
}: CommandMenuProps) {
  if (isBattleOver) {
    return null;
  }

  return (
    <section>
      <button onClick={onAttack}>Attack</button>

      <button
        onClick={onPowerStrike}
        disabled={!canUsePowerStrike}
      >
        Power Strike - 5 MP
      </button>

      <button onClick={onDefend}>Defend</button>
    </section>
  );
}