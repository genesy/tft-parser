interface Effects {
  [key: string]: string;
}

export default interface Item {
  desc: string;
  effects: Effects;
  from: number[];
  icon: string;
  id: number;
  name: string;
}
