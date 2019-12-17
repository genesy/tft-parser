const effectsMap = {
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
  "CritChancePerStack": "98ac43ce",
  "TraitMultiplier": "ae49cc70",
  "ChanceOnHitToShrink": "a56e0a21",
  "StasisDuration": "c425872e",
  "ManaRestore": "03494ad0",
  "ADPerStack": "d0fcc895",
  "MultiplierForDamage": "276ba2c8",
  "ManaPercentRestore": "69fff1ab",
  "ExtraBounces": "93d13af6",
  "SilenceDuration": "4516a18d",
}

export const parseItem = (item, index, callback = (item, index) => item) => {
  const reg = /\@(.+?)\@/gi;

  item.parsedDesc = item.desc.replace(reg, (match, g1,g2) => {
    if (item.effects[g1]) {
      return item.effects[g1];
    }
    return item.effects[`{${effectsMap[g1]}}`];
  });

  if (item.parsedDesc.indexOf('@') !== -1) {
    throw item.name + ' ' + item.parsedDesc;
  }
  return callback(item, index);
}
