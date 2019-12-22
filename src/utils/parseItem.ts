import Item from '../models/ItemModel';
import { keysToLowerCase, valuesToLowerCase } from './keysToLowerCase';

const _effectsMap = {
  "3abb8549": "CritChance",
  "c4b5579c": "DodgeChance",
  "4724fc58": "AD",
  "ce132611": "APPercentAmp",
  "eac3d5c4": "CriticalStrikeAmp",
  "2275757b": "ChanceOnHitToSilence",
  "1e0630e9": "HPThreshold",
  "dc44b1d7": "HealthRestore",
  "510fdb6a": "BanishDuration",
  "9b1e8f37": "HexRange",
  "aa03e0b1": "AttackSpeedPerStack",
  "48ea2af8": "AttackSpeedPerStack",
  "6688a0d5": "DamageReflect",
  "d0088170": "ASSlowPercentage",
  "0cc88d45": "ChanceToSpellSteal",
  "0e4779e5": "DodgeChancePercent",
  "a79cf66e": "CurrentHPPhysicalDamage",
  "a8ca7859": "AttackSpeedPercent",
  "57706a69": "BurnPercent",
  "97e52ce8": "BurnDuration",
  "6df27940": "BurnDuration",
  "98ac43ce": "CritChancePerStack",
  "cb57edb0": "CritChancePerStack",
  "ae49cc70": "TraitMultiplier",
  "a56e0a21": "ChanceOnHitToShrink",
  "c425872e": "StasisDuration",
  "03494ad0": "ManaRestore",
  "d0fcc895": "ADPerStack",
  "f1d43b01": "ADPerStack",
  "276ba2c8": "MultiplierForDamage",
  "69fff1ab": "ManaPercentRestore",
  "93d13af6": "ExtraBounces",
  "4516a18d": "SilenceDuration",
  "55ce8055": "StartingStacks",
  "ad68ce80": "StartingStacks",
  "2426ea7e": "ChanceOnHitToDisarm",
  "ec9a04d1": "MaxArmySizeIncrease",
  "e93233aa": "CleanseICD",
  "85884551": "BouncesTooltip",
  "ad16f688": "OmniVamp",
  "1bb18b94": "HPPerRound"
}

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
    throw item.name + ' ' + item.desc;
  }
  return callback(item, index);
}
