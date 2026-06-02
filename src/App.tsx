import { useState } from "react";
import { BattleLog } from "./components/BattleLog";
import { CommandMenu } from "./components/CommandMenu";
import { HpBar } from "./components/HpBar";
import { applyDamage, calculateDamage } from "./game/battleEngine";
import { enemies } from "./game/enemy";
import { startingHero } from "./game/hero";

function App() {
  const [hero, setHero] = useState({ ...startingHero });
  const [battleIndex, setBattleIndex] = useState(0);
  const [enemy, setEnemy] = useState({ ...enemies[0] });

  const [log, setLog] = useState<string[]>([
    `${enemies[0].name} appears!`,
  ]);

  const [isBattleOver, setIsBattleOver] = useState(false);

  const [battleResult, setBattleResult] = useState<
    "victory" | "defeat" | null
  >(null);

  function handleAttack() {
    if (isBattleOver) return;

    const heroDamage = calculateDamage(hero, enemy);
    const updatedEnemy = applyDamage(enemy, heroDamage);

    setEnemy(updatedEnemy);

    if (updatedEnemy.hp <= 0) {
      setIsBattleOver(true);
      setBattleResult("victory");

      setLog((prev) => [
        ...prev,
        `${hero.name} attacks for ${heroDamage} damage.`,
        `${enemy.name} was defeated!`,
      ]);

      return;
    }

    const enemyDamage = calculateDamage(enemy, hero);
    const updatedHero = applyDamage(hero, enemyDamage);

    setHero(updatedHero);

    if (updatedHero.hp <= 0) {
      setIsBattleOver(true);
      setBattleResult("defeat");
    }

    setLog((prev) => [
      ...prev,
      `${hero.name} attacks for ${heroDamage} damage.`,
      `${enemy.name} attacks for ${enemyDamage} damage.`,
    ]);
  }

  function handlePowerStrike() {
    if (isBattleOver || hero.mp < 5) return;

    const updatedHero = {
      ...hero,
      mp: hero.mp - 5,
    };

    const heroDamage = calculateDamage(updatedHero, enemy, 1.75);

    const updatedEnemy = applyDamage(enemy, heroDamage);

    setEnemy(updatedEnemy);

    if (updatedEnemy.hp <= 0) {
      setHero(updatedHero);

      setIsBattleOver(true);
      setBattleResult("victory");

      setLog((prev) => [
        ...prev,
        `${hero.name} uses Power Strike for ${heroDamage} damage.`,
        `${enemy.name} was defeated!`,
      ]);

      return;
    }

    const enemyDamage = calculateDamage(enemy, updatedHero);

    const damagedHero = applyDamage(updatedHero, enemyDamage);

    setHero(damagedHero);

    if (damagedHero.hp <= 0) {
      setIsBattleOver(true);
      setBattleResult("defeat");
    }

    setLog((prev) => [
      ...prev,
      `${hero.name} uses Power Strike for ${heroDamage} damage.`,
      `${enemy.name} attacks for ${enemyDamage} damage.`,
    ]);
  }

  function handleDefend() {
    if (isBattleOver) return;

    const reducedDamage = Math.max(
      1,
      Math.floor(calculateDamage(enemy, hero) / 2)
    );

    const updatedHero = applyDamage(hero, reducedDamage);

    setHero(updatedHero);

    if (updatedHero.hp <= 0) {
      setIsBattleOver(true);
      setBattleResult("defeat");
    }

    setLog((prev) => [
      ...prev,
      `${hero.name} defends.`,
      `${enemy.name} attacks for ${reducedDamage} damage.`,
    ]);
  }

  function handleNextBattle() {
    const nextIndex = battleIndex + 1;

    if (nextIndex >= enemies.length) {
      return;
    }

    setBattleIndex(nextIndex);
    setEnemy({ ...enemies[nextIndex] });

    setBattleResult(null);
    setIsBattleOver(false);

    setLog((prev) => [
      ...prev,
      "---",
      `${enemies[nextIndex].name} appears!`,
    ]);
  }

  function handleRestart() {
    setHero({ ...startingHero });

    setBattleIndex(0);
    setEnemy({ ...enemies[0] });

    setBattleResult(null);
    setIsBattleOver(false);

    setLog([`${enemies[0].name} appears!`]);
  }

  return (
    <main>
      <section>
        <h1>{enemy.name}</h1>

        <HpBar
          current={enemy.hp}
          max={enemy.maxHp}
        />

        <p>
          HP: {enemy.hp}/{enemy.maxHp}
        </p>
      </section>

      <hr />

      <section>
        <h2>{hero.name}</h2>

        <HpBar
          current={hero.hp}
          max={hero.maxHp}
        />

        <p>
          HP: {hero.hp}/{hero.maxHp}
        </p>

        <p>
          MP: {hero.mp}/{hero.maxMp}
        </p>
      </section>

      <hr />

      {battleResult === "victory" && (
        <>
          <h2>Victory!</h2>

          {battleIndex < enemies.length - 1 ? (
            <>
              <button onClick={handleNextBattle}>
                Next Battle
              </button>

              <button onClick={handleRestart}>
                Restart Demo
              </button>
            </>
          ) : (
            <>
              <h3>Demo Complete!</h3>

              <button onClick={handleRestart}>
                Restart Demo
              </button>
            </>
          )}
        </>
      )}

      {battleResult === "defeat" && (
        <>
          <h2>Defeat...</h2>

          <button onClick={handleRestart}>
            Restart Demo
          </button>
        </>
      )}

      <CommandMenu
        isBattleOver={isBattleOver}
        canUsePowerStrike={hero.mp >= 5}
        onAttack={handleAttack}
        onPowerStrike={handlePowerStrike}
        onDefend={handleDefend}
      />

      <BattleLog log={log} />
    </main>
  );
}

export default App;