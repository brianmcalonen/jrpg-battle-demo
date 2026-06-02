import { useState } from "react";
import { BattleLog } from "./components/BattleLog";
import { CommandMenu } from "./components/CommandMenu";
import { FighterSprite } from "./components/FighterSprite";
import { HpBar } from "./components/HpBar";
import { applyDamage, calculateDamage } from "./game/battleEngine";
import { enemies } from "./game/enemy";
import { startingHero } from "./game/hero";
import type { Enemy, Fighter } from "./game/types";
import "./App.css";

const XP_TO_LEVEL_2 = 25;

function getEnemySprite(enemyName: string): "slime" | "rat" {
  if (enemyName.toLowerCase().includes("rat")) {
    return "rat";
  }

  return "slime";
}

function applyVictoryReward(hero: Fighter, enemy: Enemy) {
  const updatedXp = hero.xp + enemy.xpReward;

  if (hero.level === 1 && updatedXp >= XP_TO_LEVEL_2) {
    return {
      updatedHero: {
        ...hero,
        level: 2,
        xp: updatedXp,
        maxHp: hero.maxHp + 20,
        hp: hero.maxHp + 20,
        maxMp: hero.maxMp + 5,
        mp: hero.maxMp + 5,
        attack: hero.attack + 3,
        defense: hero.defense + 2,
      },
      rewardLog: [
        `${hero.name} gained ${enemy.xpReward} XP.`,
        `${hero.name} reached Level 2!`,
        "HP +20, MP +5, Attack +3, Defense +2.",
      ],
    };
  }

  return {
    updatedHero: {
      ...hero,
      xp: updatedXp,
    },
    rewardLog: [`${hero.name} gained ${enemy.xpReward} XP.`],
  };
}

function App() {
  const [hero, setHero] = useState({ ...startingHero });
  const [battleIndex, setBattleIndex] = useState(0);
  const [enemy, setEnemy] = useState({ ...enemies[0] });

  const [log, setLog] = useState<string[]>([`${enemies[0].name} appears!`]);

  const [isBattleOver, setIsBattleOver] = useState(false);

  const [battleResult, setBattleResult] = useState<"victory" | "defeat" | null>(
    null
  );

  function handleVictory(
    currentHero: Fighter,
    defeatedEnemy: Enemy,
    actionLog: string
  ) {
    const { updatedHero, rewardLog } = applyVictoryReward(
      currentHero,
      defeatedEnemy
    );

    setHero(updatedHero);
    setIsBattleOver(true);
    setBattleResult("victory");

    setLog((prev) => [
      ...prev,
      actionLog,
      `${defeatedEnemy.name} was defeated!`,
      ...rewardLog,
    ]);
  }

  function handleAttack() {
    if (isBattleOver) return;

    const heroDamage = calculateDamage(hero, enemy);
    const updatedEnemy = applyDamage(enemy, heroDamage);

    setEnemy(updatedEnemy);

    if (updatedEnemy.hp <= 0) {
      handleVictory(
        hero,
        enemy,
        `${hero.name} attacks for ${heroDamage} damage.`
      );

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
      handleVictory(
        updatedHero,
        enemy,
        `${hero.name} uses Power Strike for ${heroDamage} damage.`
      );

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

    setLog((prev) => [...prev, "---", `${enemies[nextIndex].name} appears!`]);
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
    <main className="battle-screen">
      <section className="battlefield">
        <div className="hero-zone">
          <FighterSprite variant="hero" />
        </div>

        <div className="enemy-zone">
          <div className="enemy-card battle-panel">
            <h1>{enemy.name}</h1>
            <HpBar current={enemy.hp} max={enemy.maxHp} />
            <p>
              HP {enemy.hp}/{enemy.maxHp}
            </p>
          </div>

          <FighterSprite variant={getEnemySprite(enemy.name)} />
        </div>
      </section>

      <section className="hud">
        <section className="battle-panel status-panel">
          <div className="status-row">
            <strong>{hero.name}</strong>
            <span>LV {hero.level}</span>
          </div>

          <div className="status-row">
            <span>HP</span>
            <span>
              {hero.hp}/{hero.maxHp}
            </span>
          </div>

          <HpBar current={hero.hp} max={hero.maxHp} />

          <div className="status-row">
            <span>MP</span>
            <span>
              {hero.mp}/{hero.maxMp}
            </span>
          </div>

          <HpBar current={hero.mp} max={hero.maxMp} variant="mp" />

          <div className="status-row">
            <span>XP</span>
            <span>{hero.xp}</span>
          </div>

          <div className="status-row">
            <span>ATK {hero.attack}</span>
            <span>DEF {hero.defense}</span>
          </div>
        </section>

        <CommandMenu
          isBattleOver={isBattleOver}
          canUsePowerStrike={hero.mp >= 5}
          onAttack={handleAttack}
          onPowerStrike={handlePowerStrike}
          onDefend={handleDefend}
        />

        <BattleLog log={log} />
      </section>

      {battleResult === "victory" && (
        <section className="result-overlay">
          <div className="battle-panel result-box">
            <h2>Victory!</h2>

            {battleIndex < enemies.length - 1 ? (
              <>
                <button onClick={handleNextBattle}>Next Battle</button>
                <button onClick={handleRestart}>Restart Demo</button>
              </>
            ) : (
              <>
                <h3>Demo Complete!</h3>
                <button onClick={handleRestart}>Restart Demo</button>
              </>
            )}
          </div>
        </section>
      )}

      {battleResult === "defeat" && (
        <section className="result-overlay">
          <div className="battle-panel result-box">
            <h2>Defeat...</h2>
            <button onClick={handleRestart}>Restart Demo</button>
          </div>
        </section>
      )}
    </main>
  );
}

export default App;