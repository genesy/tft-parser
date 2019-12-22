
import Champion from '../models/ChampionModel';

export const parseChampion = (champion: Champion) => {
  const reg = /\@(.+?)\@/gi;

  // TODO: do this lol
  champion.ability.desc = champion.ability.desc.replace(reg, (match, _g1, g2) => {


  })
}
