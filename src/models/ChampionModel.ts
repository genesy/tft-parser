
interface SkillVar {
  name: string;
  value: number[]
}

interface Ability {
  desc: string;
  icon: string;
  name: string;
  variables: SkillVar[];
}

interface Stats {
  armor: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
  damage: number;
  hp: number;
  initialMana: number;
  magicResist: number;
  mana: number;
  range: number;
}

export default interface Champion {
  ability: Ability;
  cost: number;
  stats: Stats;
  traits: [string, string]
}
