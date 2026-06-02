import type { Fighter } from "./types";

export function calculateDamage(
  attacker: Fighter,
  defender: Fighter,
  multiplier = 1
) {
  const rawDamage = attacker.attack * multiplier - defender.defense;
  return Math.max(1, Math.floor(rawDamage));
}

export function applyDamage(target: Fighter, damage: number): Fighter {
  return {
    ...target,
    hp: Math.max(0, target.hp - damage),
  };
}