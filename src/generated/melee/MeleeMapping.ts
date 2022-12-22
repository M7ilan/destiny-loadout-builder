// This file is generated by the generateMeleeMapping.ts script.
// Do not manually make changes to this file.

import { EnumDictionary } from "@dlb/types/globals";
import { IMelee } from "@dlb/types/generation";
import { EMeleeId } from "@dlb/generated/melee/EMeleeId";
import { EElementId, EDestinySubclassId } from "@dlb/types/IdEnums";

export const MeleeIdToMeleeMapping: EnumDictionary<EMeleeId, IMelee> = {
  [EMeleeId.HammerStrike]: {
    name: "Hammer Strike",
    id: EMeleeId.HammerStrike,
    description:
      "After sprinting for a short time, use this melee ability to swing a blazing hammer that scorches your target and deals damage in a cone behind them.\n\nIf your target is defeated by Hammer Strike, they ignite.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/c2acd9c65a21454a8114266f5cc305e2.jpg",
    hash: 852252788,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Sunbreaker,
  },
  [EMeleeId.ThrowingHammer]: {
    name: "Throwing Hammer",
    id: EMeleeId.ThrowingHammer,
    description:
      "Throw a hammer from a distance. Picking up a thrown hammer fully recharges your melee ability. If the hammer struck a target, picking it up grants cure.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/36dc4a55d4829b9f36e48355151541f1.jpg",
    hash: 852252789,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Sunbreaker,
  },
  [EMeleeId.SnareBomb]: {
    name: "Snare Bomb",
    id: EMeleeId.SnareBomb,
    description:
      "Throw a Smoke Bomb, which attaches to surfaces and pings enemy radar. Weakens targets on detonation.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/528606d6c47a06743088250148150e63.jpg",
    hash: 1139822081,
    elementId: EElementId.Void,
    destinySubclassId: EDestinySubclassId.Nightstalker,
  },
  [EMeleeId.BallLightning]: {
    name: "Ball Lightning",
    id: EMeleeId.BallLightning,
    description:
      "Fire an Arc projectile forward that releases a perpendicular lightning strike after a short time.\n\nWhile amplified, Ball Lightning releases additional lightning strikes before detonating.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/5a17204b115c8dc65fca864e0db8f269.jpg",
    hash: 1232050830,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Stormcaller,
  },
  [EMeleeId.ChainLightning]: {
    name: "Chain Lightning",
    id: EMeleeId.ChainLightning,
    description:
      "An extended range melee that jolts your target and chains lightning to nearby targets.\n\nWhile amplified, it creates an additional set of chains.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/ee73db9fc021bd7ee09cb0bf23c45b45.jpg",
    hash: 1232050831,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Stormcaller,
  },
  [EMeleeId.WitheringBlade]: {
    name: "Withering Blade",
    id: EMeleeId.WitheringBlade,
    description:
      "Toss a [Stasis] Stasis Shuriken at targets to damage and slow them.  \n\nProvides multiple charges.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/19bfb77e7d68ca51a81c5d10bf87b4ed.png",
    hash: 1341767667,
    elementId: EElementId.Stasis,
    destinySubclassId: EDestinySubclassId.Revenant,
  },
  [EMeleeId.IncineratorSnap]: {
    name: "Incinerator Snap",
    id: EMeleeId.IncineratorSnap,
    description:
      "Snap your fingers to create a fan of burning sparks that explode and scorch targets.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/983f2ee371714ff7f70be898f57b64e1.jpg",
    hash: 1470370538,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Dawnblade,
  },
  [EMeleeId.CelestialFire]: {
    name: "Celestial Fire",
    id: EMeleeId.CelestialFire,
    description:
      "Send out a spiral of three explosive Solar energy blasts, scorching targets with each hit.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/ea7006fa8a79b74b5cc9868b759d98bf.jpg",
    hash: 1470370539,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Dawnblade,
  },
  [EMeleeId.ShiverStrike]: {
    name: "Shiver Strike",
    id: EMeleeId.ShiverStrike,
    description:
      "Hold input to leap through the air. Releasing unleashes a powerful dash attack that knocks targets back and damages them.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/65a6b51adbb9037fb34128588e61f5e9.png",
    hash: 2028772231,
    elementId: EElementId.Stasis,
    destinySubclassId: EDestinySubclassId.Behemoth,
  },
  [EMeleeId.PocketSingularity]: {
    name: "Pocket Singularity",
    id: EMeleeId.PocketSingularity,
    description:
      "Launch an unstable ball of Void energy that detonates when it nears a target, pushing them away from the blast and making them volatile.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/f2e94b7d9c0d06dbe014e260b79c01b9.jpg",
    hash: 2299867342,
    elementId: EElementId.Void,
    destinySubclassId: EDestinySubclassId.Voidwalker,
  },
  [EMeleeId.PenumbralBlast]: {
    name: "Penumbral Blast",
    id: EMeleeId.PenumbralBlast,
    description:
      "Raise your [Stasis] Stasis staff against your foe. Send a blast of [Stasis] Stasis forward to freeze your targets.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/a0fdf08ff3d0a3c632be0ff898a814f0.png",
    hash: 2543177538,
    elementId: EElementId.Stasis,
    destinySubclassId: EDestinySubclassId.Shadebinder,
  },
  [EMeleeId.BallisticSlam]: {
    name: "Ballistic Slam",
    id: EMeleeId.BallisticSlam,
    description:
      "After sprinting and while airborne, activate your charged melee ability to slam to the ground, dealing damage to nearby targets.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/ce2bfab135eadca1936ebb37100fe8aa.jpg",
    hash: 2708585276,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Striker,
  },
  [EMeleeId.SeismicStrike]: {
    name: "Seismic Strike",
    id: EMeleeId.SeismicStrike,
    description:
      "After sprinting for a short time, activate your charged melee ability to slam shoulder-first into your target, damaging and blinding targets in an area around them.\n\nWhile you are amplified, the blind radius is increased.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/e89c1a843b2da5b43ef526ce79990914.jpg",
    hash: 2708585277,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Striker,
  },
  [EMeleeId.Thunderclap]: {
    name: "Thunderclap",
    id: EMeleeId.Thunderclap,
    description:
      "[Melee] : Hold while grounded to plant your feet and begin charging your fist with Arc energy.\n\n[Melee] : Release to unleash a devastating blast in front of you, dealing damage that increases with longer charge time.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/0fa651ca1a85d443fc6dfec0712077e9.jpg",
    hash: 2708585279,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Striker,
  },
  [EMeleeId.DisorientingBlow]: {
    name: "Disorienting Blow",
    id: EMeleeId.DisorientingBlow,
    description:
      "Striking a target with this melee ability blinds them and amplifies you.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/e024d20dd2734aa63230651146ef8079.jpg",
    hash: 2716335210,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Arcstrider,
  },
  [EMeleeId.CombinationBlow]: {
    name: "Combination Blow",
    id: EMeleeId.CombinationBlow,
    description:
      "A quick strike that temporarily increases your melee damage when defeating a target, stacking three times.\n\nDefeating targets with this ability also fully refills your class ability energy and restores a small amount of health.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/19fcbeeb210725a3f92f854fbed6994e.jpg",
    hash: 2716335211,
    elementId: EElementId.Arc,
    destinySubclassId: EDestinySubclassId.Arcstrider,
  },
  [EMeleeId.KnifeTrick]: {
    name: "Knife Trick",
    id: EMeleeId.KnifeTrick,
    description: "Throw a fan of flaming knives that scorch targets on hit.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/e8a3f6085e7624845b9a55ab7fecd4b9.jpg",
    hash: 4016776972,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Gunslinger,
  },
  [EMeleeId.ProximityExplosiveKnife]: {
    name: "Proximity Explosive Knife",
    id: EMeleeId.ProximityExplosiveKnife,
    description:
      "Throw a knife that attaches to surfaces upon impact and explodes when it detects a nearby target.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/454eea8d4cbb81e80285c0b04f155789.jpg",
    hash: 4016776973,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Gunslinger,
  },
  [EMeleeId.LightweightKnife]: {
    name: "Lightweight Knife",
    id: EMeleeId.LightweightKnife,
    description:
      "Quickly throw a knife that deals moderate damage. Precision hits with this knife make you radiant for a short duration.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/ac48c2a8fd779eea2e99e997944ed2cb.jpg",
    hash: 4016776974,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Gunslinger,
  },
  [EMeleeId.WeightedThrowingKnife]: {
    name: "Weighted Throwing Knife",
    id: EMeleeId.WeightedThrowingKnife,
    description:
      "Throw a knife that deals extra precision damage and causes scorched targets to ignite.\n\nPrecision final blows with this knife immediately recharge your class ability.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/887cfc32f0b0d64584554b7ebef24c6e.jpg",
    hash: 4016776975,
    elementId: EElementId.Solar,
    destinySubclassId: EDestinySubclassId.Gunslinger,
  },
  [EMeleeId.ShieldThrow]: {
    name: "Shield Throw",
    id: EMeleeId.ShieldThrow,
    description:
      "Hurl your Void Shield toward a target. The shield can ricochet off targets and surfaces, granting Overshield for each target hit.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/aec868e7b28d12707c7b5d7f54d68616.jpg",
    hash: 4220332374,
    elementId: EElementId.Void,
    destinySubclassId: EDestinySubclassId.Sentinel,
  },
  [EMeleeId.ShieldBash]: {
    name: "Shield Bash",
    id: EMeleeId.ShieldBash,
    description:
      "After sprinting for a short time, use this melee ability to unleash a devastating Shield Bash that suppresses the target. Final blows with Shield Bash grant an Overshield.",
    icon: "https://www.bungie.net/common/destiny2_content/icons/ea6c9bcd39c249ea1acfab188e93cd85.jpg",
    hash: 4220332375,
    elementId: EElementId.Void,
    destinySubclassId: EDestinySubclassId.Sentinel,
  },
};
