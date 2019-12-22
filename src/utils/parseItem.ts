import Item from '../models/ItemModel';
import { keysToLowerCase, valuesToLowerCase } from './keysToLowerCase';
import _effectsMap from '../itemEffectsData';

const effectsMap = valuesToLowerCase(_effectsMap);

const removeCurly = (string: string = '') => string.replace('{', '').replace('}', '');

export const parseItem = (item, index, callback = (item, index) => item) => {
  const reg = /\@(.+?)\@/gi;

  // change hex effects keys to readable strings;
  item.effects = keysToLowerCase(item.effects)
  const newEffects = {};
  Object.keys(item.effects).forEach((key: string) => {
    if (typeof item.effects[key] === 'undefined') {
      console.log('ERROR')
      console.log(item.name)
      console.log(item.effects, key)
      throw 'ERROR';
    }
    if (key[0] !== '{') {
      newEffects[key] = item.effects[key];
      return;
    }
    const hexValue = removeCurly(key);
    newEffects[effectsMap[hexValue]] = item.effects[key];
  });
  item.effects = newEffects;


  item.desc = item.desc.replace(reg, (match, _g1,g2) => {
    const g1 = _g1.toLowerCase();
    if (item.effects[g1]) {
      return item.effects[g1];
    }

    let hexValue = effectsMap[g1]

    if (typeof hexValue === 'object') {
      hexValue = hexValue.filter((_hexValue: string) => item.effects[`{${_hexValue}}`])
    }

    if (hexValue === '55ce8055') return 1; // null from tft data for some reason..
    return item.effects[g1];
  });

  if (item.desc.indexOf('@') !== -1 || item.desc.indexOf('undefined') !== -1) {
    // throw item.name + ' ' + item.desc;
    item.error = true;
  }
  return callback(item, index);
}
