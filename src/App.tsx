import { useState } from "react";
import { BattleLog } from "./components/BattleLog";
import { CommandMenu } from "./components/CommandMenu";
import { HpBar } from "./components/HpBar";
import { applyDamage, calculateDamage } from "./game/battleEngine";
import { trainingSlime } from "./game/enemy";
import { startingHero } from "./game/hero";

function App() {
  const [hero, setHero] = useState(startingHero);
  const [enemy, setEnemy] = useState(trainingSlime);
  const [log, setLog] = useState<string[]>([
    "A Training Slime appears!",
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

    const heroDamage = calculateDamage(
      updatedHero,
      enemy,
      1.75
    );

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

    const damagedHero = applyDamage(
      updatedHero,
      enemyDamage
    );

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

    const updatedHero = applyDamage(
      hero,
      reducedDamage
    );

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

  function handleRestart() {
    setHero(startingHero);
    setEnemy(trainingSlime);

    setBattleResult(null);
    setIsBattleOver(false);

    setLog(["A Training Slime appears!"]);
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
        <h2>Victory!</h2>
      )}

      {battleResult === "defeat" && (
        <h2>Defeat...</h2>
      )}

      <CommandMenu
        isBattleOver={isBattleOver}
        canUsePowerStrike={hero.mp >= 5}
        onAttack={handleAttack}
        onPowerStrike={handlePowerStrike}
        onDefend={handleDefend}
        onRestart={handleRestart}
      />

      <BattleLog log={log} />
    </main>
  );
}

export default App;