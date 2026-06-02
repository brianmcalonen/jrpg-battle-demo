import { useState } from "react";
import { startingHero } from "./game/hero";
import { trainingSlime } from "./game/enemy";
import { applyDamage, calculateDamage } from "./game/battleEngine";

function App() {
  const [hero, setHero] = useState(startingHero);
  const [enemy, setEnemy] = useState(trainingSlime);
  const [log, setLog] = useState<string[]>(["A Training Slime appears!"]);

  function handleAttack() {
    const heroDamage = calculateDamage(hero, enemy);
    const updatedEnemy = applyDamage(enemy, heroDamage);

    setEnemy(updatedEnemy);

    if (updatedEnemy.hp <= 0) {
      setLog((prev) => [
        `${hero.name} attacks for ${heroDamage} damage.`,
        `${enemy.name} was defeated!`,
        ...prev,
      ]);
      return;
    }

    const enemyDamage = calculateDamage(enemy, hero);
    const updatedHero = applyDamage(hero, enemyDamage);

    setHero(updatedHero);

    setLog((prev) => [
      `${hero.name} attacks for ${heroDamage} damage.`,
      `${enemy.name} attacks for ${enemyDamage} damage.`,
      ...prev,
    ]);
  }

  return (
    <main>
      <h1>{enemy.name}</h1>

      <p>
        HP: {enemy.hp}/{enemy.maxHp}
      </p>

      <hr />

      <h2>{hero.name}</h2>

      <p>
        HP: {hero.hp}/{hero.maxHp}
      </p>

      <p>
        MP: {hero.mp}/{hero.maxMp}
      </p>

      <hr />

      <button onClick={handleAttack}>Attack</button>

      <section>
        <h3>Battle Log</h3>

        {log.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </section>
    </main>
  );
}

export default App;