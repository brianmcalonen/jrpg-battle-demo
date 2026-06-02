export type Fighter = {
  name: string;
  level: number;
  xp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
};

export type Enemy = Fighter & {
  xpReward: number;
};