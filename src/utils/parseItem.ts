import Item from '../models/ItemModel';

const _effectsMap = {
  "CritChance": "3abb8549",
  "DodgeChance": "c4b5579c",
  "AD": "4724fc58",
  "APPercentAmp": "ce132611",
  "CriticalStrikeAmp": "eac3d5c4",
  "ChanceOnHitToSilence": "2275757b",
  "HPThreshold": "1e0630e9",
  "HealthRestore": "dc44b1d7",
  "BanishDuration": "510fdb6a",
  "HexRange": "9b1e8f37",
  "AttackSpeedPerStack": ["aa03e0b1", "48ea2af8"],
  "DamageReflect": "6688a0d5",
  "ASSlowPercentage": "c4b5579c",
  "ChanceToSpellSteal": "0cc88d45",
  "DodgeChancePercent": "0e4779e5",
  "CurrentHPPhysicalDamage": "a79cf66e",
  "AttackSpeedPercent": "a8ca7859",
  "BurnPercent": "57706a69",
  "BurnDuration": "97e52ce8", // or 6df27940
  "CritChancePerStack": ["98ac43ce", "cb57edb0"],
  "TraitMultiplier": "ae49cc70",
  "ChanceOnHitToShrink": "a56e0a21",
  "StasisDuration": "c425872e",
  "ManaRestore": "03494ad0",
  "ADPerStack": ["d0fcc895", "f1d43b01"],
  "MultiplierForDamage": "276ba2c8",
  "ManaPercentRestore": "69fff1ab",
  "ExtraBounces": "93d13af6",
  "SilenceDuration": "4516a18d",
  "StartingStacks": ["55ce8055", "ad68ce80"],
  "ChanceOnHitToDisarm": "2426ea7e",
  "MaxArmySizeIncrease": "ec9a04d1",
  "CleanseICD": "e93233aa",
  "BouncesTooltip": "85884551",
  "OmniVamp": "ad16f688",
  "HPPerRound": "1bb18b94"
}


const keysToLowerCase = (obj) => {
  const newObj = {}
  Object.keys(obj).forEach((key) => {
    newObj[key.toLowerCase()] = obj[key];
  });
  return newObj;
}

const effectsMap = keysToLowerCase(_effectsMap);

export const parseItem = (item, index, callback = (item, index) => item) => {
  const reg = /\@(.+?)\@/gi;

  item.desc = item.desc.replace(reg, (match, _g1,g2) => {
    const g1 = _g1.toLowerCase();
    item.effects = keysToLowerCase(item.effects);
    if (item.effects[g1]) {
      return item.effects[g1];
    }

    let hexValue = effectsMap[g1]

    if (typeof hexValue === 'object') {
      hexValue = hexValue.filter(_hexValue => item.effects[`{${_hexValue}}`])
    }

    if (hexValue === '55ce8055') return 1;

    Object.defineProperty(item.effects, g1,
      Object.getOwnPropertyDescriptor(item.effects, `{${hexValue}}`));
    delete item.effects[`{${hexValue}}`];

    return item.effects[g1];
  });

  if (item.desc.indexOf('@') !== -1 || item.desc.indexOf('undefined') !== -1) {
    throw item.name + ' ' + item.desc;
  }
  return callback(item, index);
}
