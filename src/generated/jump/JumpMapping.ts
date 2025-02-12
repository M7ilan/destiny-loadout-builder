// This file is generated by the generateJumpMapping.ts script.
// Do not manually make changes to this file.

import { EnumDictionary } from '@dlb/types/globals';
import { IJump } from '@dlb/types/generation';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EElementId, EDestinySubclassId } from '@dlb/types/IdEnums';

export const JumpIdToJumpMapping: EnumDictionary<EJumpId, IJump> = {
	[EJumpId.TripleJumpVoid]: {
		name: 'Triple Jump',
		id: EJumpId.TripleJumpVoid,
		description:
			'While airborne, sustain your air control with a second or third jump.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/733d623b28e7c56d2e1aa4f5d9aae685.jpg',
		hash: 20616656,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Nightstalker,
	},
	[EJumpId.HighJumpVoid]: {
		name: 'High Jump',
		id: EJumpId.HighJumpVoid,
		description: 'While airborne, jump a second time to reach greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/27879b83074e70dab436973f45b83cac.jpg',
		hash: 20616658,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Nightstalker,
	},
	[EJumpId.StrafeJumpVoid]: {
		name: 'Strafe Jump',
		id: EJumpId.StrafeJumpVoid,
		description:
			'While airborne, jump a second time with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1e236c74f7d5193df3472765245ca55c.jpg',
		hash: 20616659,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Nightstalker,
	},
	[EJumpId.TripleJumpArc]: {
		name: 'Triple Jump',
		id: EJumpId.TripleJumpArc,
		description:
			'While airborne, sustain your air control with a second or third jump.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/fb5c90f3df4b9e1d4dede6d807f34ed6.jpg',
		hash: 95544328,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Arcstrider,
	},
	[EJumpId.BlinkArc]: {
		name: 'Blink',
		id: EJumpId.BlinkArc,
		description: 'Jump while airborne to teleport a short distance.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/df3f7482cf7667181369db14b7115f38.jpg',
		hash: 95544329,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Arcstrider,
	},
	[EJumpId.HighJumpArc]: {
		name: 'High Jump',
		id: EJumpId.HighJumpArc,
		description: 'While airborne, jump a second time to reach greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1c99afbdead82ec1defcbed010ce07db.jpg',
		hash: 95544330,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Arcstrider,
	},
	[EJumpId.StrafeJumpArc]: {
		name: 'Strafe Jump',
		id: EJumpId.StrafeJumpArc,
		description:
			'While airborne, jump a second time with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/43b8b5a84ec3bbdc78fb83427f743962.jpg',
		hash: 95544331,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Arcstrider,
	},
	[EJumpId.HighLiftStasis]: {
		name: 'High Lift',
		id: EJumpId.HighLiftStasis,
		description:
			'Jump while airborne to activate Lift and launch into the air to greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f19a22d03d53694cb927e11e82899dca.png',
		hash: 469281040,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Behemoth,
	},
	[EJumpId.StrafeLiftStasis]: {
		name: 'Strafe Lift',
		id: EJumpId.StrafeLiftStasis,
		description:
			'Jump while airborne to activate Lift and launch into the air with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/416f132a08d1c15a57adc7c528c17ce5.png',
		hash: 469281041,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Behemoth,
	},
	[EJumpId.CatapultLiftStasis]: {
		name: 'Catapult Lift',
		id: EJumpId.CatapultLiftStasis,
		description:
			'Jump while airborne to activate Lift and launch into the air with a strong initial burst of momentum.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/22167767b81dea77781871eeb1e7d3de.png',
		hash: 469281042,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Behemoth,
	},
	[EJumpId.BurstGlideStasis]: {
		name: 'Burst Glide',
		id: EJumpId.BurstGlideStasis,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with a strong initial boost of speed.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/63af5e661089e6a1abbbe70186573a50.png',
		hash: 890263312,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Shadebinder,
	},
	[EJumpId.StrafeGlideStasis]: {
		name: 'Strafe Glide',
		id: EJumpId.StrafeGlideStasis,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/800f5b922e2215630b83d4a7cdc8cc64.png',
		hash: 890263313,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Shadebinder,
	},
	[EJumpId.BalancedGlideStasis]: {
		name: 'Balanced Glide',
		id: EJumpId.BalancedGlideStasis,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with both moderate speed and directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e2fe3d4207f35f35ad532e8798897f62.png',
		hash: 890263315,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Shadebinder,
	},
	[EJumpId.TripleJumpSolar]: {
		name: 'Triple Jump',
		id: EJumpId.TripleJumpSolar,
		description:
			'While airborne, sustain your air control with a second or third jump.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e919562f619672aae70ede8fc29e9bad.jpg',
		hash: 1128768652,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Gunslinger,
	},
	[EJumpId.HighJumpSolar]: {
		name: 'High Jump',
		id: EJumpId.HighJumpSolar,
		description: 'While airborne, jump a second time to reach greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/dc0fd818a2524460a372e0ecf6799237.jpg',
		hash: 1128768654,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Gunslinger,
	},
	[EJumpId.StrafeJumpSolar]: {
		name: 'Strafe Jump',
		id: EJumpId.StrafeJumpSolar,
		description:
			'While airborne, jump a second time with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/66fcf6f378ae895674ea601637166d28.jpg',
		hash: 1128768655,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Gunslinger,
	},
	[EJumpId.BlinkVoid]: {
		name: 'Blink',
		id: EJumpId.BlinkVoid,
		description: 'Jump while airborne to teleport a short distance.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/6930fabff4175da3425bfe9e1c4b2c54.jpg',
		hash: 1237488984,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Voidwalker,
	},
	[EJumpId.BalancedGlideVoid]: {
		name: 'Balanced Glide',
		id: EJumpId.BalancedGlideVoid,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with both moderate speed and directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/49cfe74194450ed0a6d78fe12cb5e781.jpg',
		hash: 1237488985,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Voidwalker,
	},
	[EJumpId.BurstGlideVoid]: {
		name: 'Burst Glide',
		id: EJumpId.BurstGlideVoid,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with a strong initial boost of speed.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/88d1827b19c92ccc9c6aea0e62369f24.jpg',
		hash: 1237488986,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Voidwalker,
	},
	[EJumpId.StrafeGlideVoid]: {
		name: 'Strafe Glide',
		id: EJumpId.StrafeGlideVoid,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/71a15700b61f44a8d96772850d481292.jpg',
		hash: 1237488987,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Voidwalker,
	},
	[EJumpId.CatapultLiftVoid]: {
		name: 'Catapult Lift',
		id: EJumpId.CatapultLiftVoid,
		description:
			'Jump while airborne to activate Lift and launch into the air with a strong initial burst of momentum.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/b00e7edf76ae296eee2cca55c3a57fa6.jpg',
		hash: 1380268164,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Sentinel,
	},
	[EJumpId.HighLiftVoid]: {
		name: 'High Lift',
		id: EJumpId.HighLiftVoid,
		description:
			'Jump while airborne to activate Lift and launch into the air to greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/22e574350e9146bd8f5a46772c7db929.jpg',
		hash: 1380268166,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Sentinel,
	},
	[EJumpId.StrafeLiftVoid]: {
		name: 'Strafe Lift',
		id: EJumpId.StrafeLiftVoid,
		description:
			'Jump while airborne to activate Lift and launch into the air with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/212aa3862f79fdc9befc4b2c45df7492.jpg',
		hash: 1380268167,
		elementId: EElementId.Void,
		destinySubclassId: EDestinySubclassId.Sentinel,
	},
	[EJumpId.CatapultLiftArc]: {
		name: 'Catapult Lift',
		id: EJumpId.CatapultLiftArc,
		description:
			'Jump while airborne to activate Lift and launch into the air with a strong initial burst of momentum.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/32bfe820d982e00fac25c9aab277ebc3.jpg',
		hash: 1698387812,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Striker,
	},
	[EJumpId.HighLiftArc]: {
		name: 'High Lift',
		id: EJumpId.HighLiftArc,
		description:
			'Jump while airborne to activate Lift and launch into the air to greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/07116cfce5a59222d658729cffb0f29c.jpg',
		hash: 1698387814,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Striker,
	},
	[EJumpId.StrafeLiftArc]: {
		name: 'Strafe Lift',
		id: EJumpId.StrafeLiftArc,
		description:
			'Jump while airborne to activate Lift and launch into the air with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/78e14c7fa1b842f2ffc9bdaa24aecc70.jpg',
		hash: 1698387815,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Striker,
	},
	[EJumpId.HighLiftSolar]: {
		name: 'High Lift',
		id: EJumpId.HighLiftSolar,
		description:
			'Jump while airborne to activate Lift and launch into the air to greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/8c5e43c387cef35435b121f422eaf0c6.jpg',
		hash: 2225231092,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Sunbreaker,
	},
	[EJumpId.StrafeLiftSolar]: {
		name: 'Strafe Lift',
		id: EJumpId.StrafeLiftSolar,
		description:
			'Jump while airborne to activate Lift and launch into the air with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/056b7f222c704d759b793d9202cad169.jpg',
		hash: 2225231093,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Sunbreaker,
	},
	[EJumpId.CatapultLiftSolar]: {
		name: 'Catapult Lift',
		id: EJumpId.CatapultLiftSolar,
		description:
			'Jump while airborne to activate Lift and launch into the air with a strong initial burst of momentum.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/837b14251d5b776849065059c6594a75.jpg',
		hash: 2225231094,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Sunbreaker,
	},
	[EJumpId.StrafeGlideStrand]: {
		name: 'Strafe Glide',
		id: EJumpId.StrafeGlideStrand,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/800f5b922e2215630b83d4a7cdc8cc64.png',
		hash: 2628485816,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Broodweaver,
	},
	[EJumpId.BurstGlideStrand]: {
		name: 'Burst Glide',
		id: EJumpId.BurstGlideStrand,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with a strong initial boost of speed.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/63af5e661089e6a1abbbe70186573a50.png',
		hash: 2628485817,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Broodweaver,
	},
	[EJumpId.BalancedGlideStrand]: {
		name: 'Balanced Glide',
		id: EJumpId.BalancedGlideStrand,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with both moderate speed and directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/e2fe3d4207f35f35ad532e8798897f62.png',
		hash: 2628485818,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Broodweaver,
	},
	[EJumpId.StrafeLiftStrand]: {
		name: 'Strafe Lift',
		id: EJumpId.StrafeLiftStrand,
		description:
			'Jump while airborne to activate Lift and launch into the air with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/416f132a08d1c15a57adc7c528c17ce5.png',
		hash: 3350493948,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Berserker,
	},
	[EJumpId.HighLiftStrand]: {
		name: 'High Lift',
		id: EJumpId.HighLiftStrand,
		description:
			'Jump while airborne to activate Lift and launch into the air to greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f19a22d03d53694cb927e11e82899dca.png',
		hash: 3350493949,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Berserker,
	},
	[EJumpId.CatapultLiftStrand]: {
		name: 'Catapult Lift',
		id: EJumpId.CatapultLiftStrand,
		description:
			'Jump while airborne to activate Lift and launch into the air with a strong initial burst of momentum.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/22167767b81dea77781871eeb1e7d3de.png',
		hash: 3350493951,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Berserker,
	},
	[EJumpId.TripleJumpStasis]: {
		name: 'Triple Jump',
		id: EJumpId.TripleJumpStasis,
		description:
			'While airborne, sustain your air control with a second or third jump.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7d5eb73f61509271037f810480a2e804.png',
		hash: 3531427692,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Revenant,
	},
	[EJumpId.HighJumpStasis]: {
		name: 'High Jump',
		id: EJumpId.HighJumpStasis,
		description: 'While airborne, jump a second time to reach greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3321f82be875774d96615fb2242079b5.png',
		hash: 3531427694,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Revenant,
	},
	[EJumpId.StrafeJumpStasis]: {
		name: 'Strafe Jump',
		id: EJumpId.StrafeJumpStasis,
		description:
			'While airborne, jump a second time with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1eeb42a2f303c00ded47299ca91aa72f.png',
		hash: 3531427695,
		elementId: EElementId.Stasis,
		destinySubclassId: EDestinySubclassId.Revenant,
	},
	[EJumpId.BalancedGlideSolar]: {
		name: 'Balanced Glide',
		id: EJumpId.BalancedGlideSolar,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with both moderate speed and directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/54787094e4be70a56fd1ccabb68f878f.jpg',
		hash: 3686638441,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Dawnblade,
	},
	[EJumpId.BurstGlideSolar]: {
		name: 'Burst Glide',
		id: EJumpId.BurstGlideSolar,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with a strong initial boost of speed.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/f7b19afecf6554f32225e80cc57d4fac.jpg',
		hash: 3686638442,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Dawnblade,
	},
	[EJumpId.StrafeGlideSolar]: {
		name: 'Strafe Glide',
		id: EJumpId.StrafeGlideSolar,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/4791b9df93b673dd1e67a132032b092e.jpg',
		hash: 3686638443,
		elementId: EElementId.Solar,
		destinySubclassId: EDestinySubclassId.Dawnblade,
	},
	[EJumpId.TripleJumpStrand]: {
		name: 'Triple Jump',
		id: EJumpId.TripleJumpStrand,
		description:
			'While airborne, sustain your air control with a second or third jump.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/7d5eb73f61509271037f810480a2e804.png',
		hash: 3721022585,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Threadrunner,
	},
	[EJumpId.StrafeJumpStrand]: {
		name: 'Strafe Jump',
		id: EJumpId.StrafeJumpStrand,
		description:
			'While airborne, jump a second time with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/1eeb42a2f303c00ded47299ca91aa72f.png',
		hash: 3721022586,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Threadrunner,
	},
	[EJumpId.HighJumpStrand]: {
		name: 'High Jump',
		id: EJumpId.HighJumpStrand,
		description: 'While airborne, jump a second time to reach greater heights.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/3321f82be875774d96615fb2242079b5.png',
		hash: 3721022587,
		elementId: EElementId.Strand,
		destinySubclassId: EDestinySubclassId.Threadrunner,
	},
	[EJumpId.BurstGlideArc]: {
		name: 'Burst Glide',
		id: EJumpId.BurstGlideArc,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with a strong initial boost of speed.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/83a6090aa638a9d756d5ef03e48b7843.jpg',
		hash: 4154539168,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Stormcaller,
	},
	[EJumpId.StrafeGlideArc]: {
		name: 'Strafe Glide',
		id: EJumpId.StrafeGlideArc,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with strong directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/c066f355e320df124b360384e86aece6.jpg',
		hash: 4154539169,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Stormcaller,
	},
	[EJumpId.BalancedGlideArc]: {
		name: 'Balanced Glide',
		id: EJumpId.BalancedGlideArc,
		description:
			'Jump while airborne to activate Glide and start an airborne drift with both moderate speed and directional control.',
		icon: 'https://www.bungie.net/common/destiny2_content/icons/80478b4a287cee04d75599c7fab4e47e.jpg',
		hash: 4154539171,
		elementId: EElementId.Arc,
		destinySubclassId: EDestinySubclassId.Stormcaller,
	},
};
