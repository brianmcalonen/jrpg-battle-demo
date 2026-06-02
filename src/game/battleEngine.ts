import type { Fighter } from "./types";

export function calculateDamage(attacker: Fighter, defender: Fighter) {
  const rawDamage = attacker.attack - defender.defense;
  return Math.max(1, rawDamage);
}

export function applyDamage(target: Fighter, damage: number): Fighter {
  return {
    ...target,
    hp: Math.max(0, target.hp - damage),
  };
}