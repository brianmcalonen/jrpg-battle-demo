import { startingHero } from "./game/hero";
import { trainingSlime } from "./game/enemy";
import { useState } from "react";

function App() {
const [hero] = useState(startingHero);
const [enemy] = useState(trainingSlime);

return (
  <main>
    <h1>{trainingSlime.name}</h1>

    <p>
      HP: {trainingSlime.hp}/{trainingSlime.maxHp}
    </p>

    <hr />

    <h2>{startingHero.name}</h2>

    <p>
      HP: {startingHero.hp}/{startingHero.maxHp}
    </p>

    <p>
      MP: {startingHero.mp}/{startingHero.maxMp}
    </p>
  </main>
);
}

export default App;