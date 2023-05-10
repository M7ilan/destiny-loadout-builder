import {
	getDefaultSeenArmorSlotItems,
	shouldShortCircuit,
	ShouldShortCircuitOutput,
	ShouldShortCircuitParams,
} from '@dlb/services/armor-processing';
import { describe, expect, test } from '@jest/globals';
import {
	EArmorStatId,
	EArmorSlotId,
	EDestinyClassId,
} from '@dlb/types/IdEnums';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	getDefaultArmorMetadata,
	getDefaultAvailableExoticArmorItem,
} from '@dlb/types/Armor';

const defaultArmorMetadata = getDefaultArmorMetadata();

const generateDefaultArmorSlotIdToModIDListMapping =
	(): ArmorSlotIdToModIdListMapping => {
		return ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
			accumulator[currentValue] = [null, null, null];
			return accumulator;
		}, {}) as ArmorSlotIdToModIdListMapping;
	};

const generateDefaultValidRaidModArmorSlotPlacements =
	(): PotentialRaidModArmorSlotPlacement[] => {
		return [
			ArmorSlotWithClassItemIdList.reduce((accumulator, currentValue) => {
				accumulator[currentValue] = null;
				return accumulator;
			}, {}),
		] as PotentialRaidModArmorSlotPlacement[];
	};

type ShouldShortCircuitTestCase = {
	name: string;
	input: ShouldShortCircuitParams;
	output: ShouldShortCircuitOutput;
};

const shouldShortCircuitTestCases: ShouldShortCircuitTestCase[] = [
	// 0
	{
		name: 'It returns true when helmet, gauntlets, and chest mobility are all 2',
		input: {
			sumOfSeenStats: [6, 48, 48, 48, 48, 6],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 1,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: true,
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MobilityMod,
				EModId.MinorMobilityMod,
			],
			requiredArtificeModIdList: [],
			// [
			// 	Array(21).fill(EModId.DisciplineForged),
			// 	Array(21).fill(EModId.StrengthForged),
			// ].flat(),
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 65,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: EArmorSlotId.Chest,
		},
	},
	// 1
	{
		name: 'It returns false when helmet and gauntlets strength are both 2',
		input: {
			sumOfSeenStats: [4, 32, 32, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 100,
			},
			numRemainingArmorPieces: 2,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: false,
			requiredArmorStatModIdList: [
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.MinorStrengthMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 35,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
	// 2
	{
		name: 'It returns true when helmet and gauntlets strength are both 2, helmet discipline is 2 and gauntlets discipline is 16',
		input: {
			sumOfSeenStats: [4, 32, 32, 18, 46, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 100,
			},
			numRemainingArmorPieces: 2,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: true,
			requiredArmorStatModIdList: [
				EModId.DisciplineMod,
				EModId.DisciplineMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.MinorStrengthMod,
			],
			requiredArtificeModIdList: [],
			// [
			// 	Array(21).fill(EModId.DisciplineForged),
			// 	Array(21).fill(EModId.StrengthForged),
			// ].flat(),
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 20,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 35,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: EArmorSlotId.Arm,
		},
	},
	// 3
	{
		name: 'It returns true immediately when the stat requirements are impossibly high',
		input: {
			sumOfSeenStats: [2, 16, 16, 2, 30, 2],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 100,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 150,
			},
			numRemainingArmorPieces: 3,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: true,
			requiredArmorStatModIdList: [
				EModId.MinorDisciplineMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.StrengthMod,
				EModId.MinorStrengthMod,
			],
			requiredArtificeModIdList: [],
			// [
			// 	Array(31).fill(EModId.DisciplineForged),
			// 	Array(31).fill(EModId.StrengthForged),
			// ].flat(),
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 5,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 55,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: EArmorSlotId.Head,
		},
	},
	// 4
	{
		name: 'It returns false when gauntlets mobility is 46',
		input: {
			sumOfSeenStats: [46, 4, 18, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: false,
			requiredArmorStatModIdList: [],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
	// 5
	{
		name: 'It returns false when helmet mobility is 40',
		input: {
			sumOfSeenStats: [40, 4, 24, 32, 32, 4],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 100,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 2,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: generateDefaultArmorSlotIdToModIDListMapping(),
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: false,
			requiredArmorStatModIdList: [],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
	// 6
	{
		name: 'It returns true when there is nowhere to put the required armor stat mods due to the cost of raid mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 50, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validRaidModArmorSlotPlacements: [
				{
					[EArmorSlotId.Head]: EModId.EnhancedRelayDefender,
					[EArmorSlotId.Arm]: null,
					[EArmorSlotId.Chest]: null,
					[EArmorSlotId.Leg]: null,
					[EArmorSlotId.ClassItem]: null,
				},
			],
			armorSlotMods: {
				...generateDefaultArmorSlotIdToModIDListMapping(),
				[EArmorSlotId.Head]: [
					EModId.HeavyAmmoFinder,
					EModId.SpecialAmmoFinder,
					EModId.ArcSiphon,
				],
			},
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: true,
			requiredArmorStatModIdList: [
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 50,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
	// 7
	{
		name: 'It returns true when there is nowhere to put the required armor stat mods due to the cost of armor slot mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 60, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validRaidModArmorSlotPlacements:
				generateDefaultValidRaidModArmorSlotPlacements(),
			armorSlotMods: {
				...generateDefaultArmorSlotIdToModIDListMapping(),
				[EArmorSlotId.Chest]: [
					EModId.ShieldBreakCharge,
					EModId.ConcussiveDampener,
					EModId.SniperDamageResistance,
				],
				[EArmorSlotId.ClassItem]: [
					EModId.Distribution,
					EModId.Distribution,
					EModId.FontOfRestoration,
				],
			},
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: true,
			requiredArmorStatModIdList: [
				EModId.RecoveryMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
				EModId.IntellectMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 40,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
	// 8
	{
		name: 'It returns true when there is nowhere to put the required armor stat mods due to the combined cost of armor slot mods and raid mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 95, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validRaidModArmorSlotPlacements: [
				{
					[EArmorSlotId.Head]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.Arm]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.Chest]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.Leg]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.ClassItem]: EModId.ResistantTether, // Cost 1
				},
			],
			armorSlotMods: {
				[EArmorSlotId.Head]: [
					EModId.SpecialAmmoFinder,
					EModId.HeavyAmmoFinder,
					EModId.HarmonicSiphon,
				], // 3 + [3, 3, 1] = Capacity: 0
				[EArmorSlotId.Arm]: [EModId.GrenadeKickstart, null, null], // 3 + [3, 0, 0] = Capacity: 4
				[EArmorSlotId.Chest]: [
					EModId.ChargedUp,
					EModId.ConcussiveDampener,
					EModId.HarmonicResistance,
				], // 3 + [3, 3, 1] = Capacity: 0
				[EArmorSlotId.Leg]: [null, EModId.StacksOnStacks, null], // 3 + [0, 4, 0] = Capacity: 3
				[EArmorSlotId.ClassItem]: [
					EModId.Distribution,
					EModId.Distribution,
					EModId.FontOfRestoration,
				], // 1 + [3, 3, 3] = Capacity: 0
			},
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: true,
			requiredArmorStatModIdList: [
				EModId.MobilityMod,
				EModId.RecoveryMod,
				EModId.MinorIntellectMod,
			],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 5,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
	// 9
	{
		name: 'It returns false when there is space to put the required armor stat mods even with the combined cost of armor slot mods and raid mods',
		input: {
			sumOfSeenStats: [0, 0, 0, 0, 100, 0],
			desiredArmorStats: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 100,
				[EArmorStatId.Strength]: 0,
			},
			numRemainingArmorPieces: 0,
			validRaidModArmorSlotPlacements: [
				{
					[EArmorSlotId.Head]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.Arm]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.Chest]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.Leg]: EModId.EnhancedRelayDefender, // Cost 3
					[EArmorSlotId.ClassItem]: EModId.ResistantTether, // Cost 1
				},
			],
			armorSlotMods: {
				[EArmorSlotId.Head]: [
					EModId.SpecialAmmoFinder,
					EModId.HeavyAmmoFinder,
					EModId.HarmonicSiphon,
				], // 3 + [3, 3, 1] = Capacity: 0
				[EArmorSlotId.Arm]: [EModId.GrenadeKickstart, null, null], // 3 + [3, 0, 0] = Capacity: 4
				[EArmorSlotId.Chest]: [
					EModId.ChargedUp,
					EModId.ConcussiveDampener,
					EModId.HarmonicResistance,
				], // 3 + [3, 3, 1] = Capacity: 0
				[EArmorSlotId.Leg]: [null, EModId.StacksOnStacks, null], // 3 + [0, 4, 0] = Capacity: 3
				[EArmorSlotId.ClassItem]: [
					EModId.Distribution,
					EModId.Distribution,
					EModId.FontOfRestoration,
				], // 1 + [3, 3, 3] = Capacity: 0
			},
			raidMods: [],
			destinyClassId: EDestinyClassId.Warlock,
			specialSeenArmorSlotItems: getDefaultSeenArmorSlotItems(),
			armorMetadataItem: defaultArmorMetadata.Warlock,
			selectedExotic: getDefaultAvailableExoticArmorItem(),
		},
		output: {
			shortCircuit: false,
			requiredArmorStatModIdList: [EModId.MobilityMod, EModId.RecoveryMod],
			requiredArtificeModIdList: [],
			requiredArmorStatModsArmorStatMapping: {
				[EArmorStatId.Mobility]: 10,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 10,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			numUnusedArtificeMods: 0,
			requiredClassItemExtraModSocketCategoryId: null,
			armorStat: null,
			slot: null,
		},
	},
];

describe('shouldShortCircuit', () => {
	test(shouldShortCircuitTestCases[0].name, () => {
		const { input, output } = shouldShortCircuitTestCases[0];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[1].name, () => {
		const { input, output } = shouldShortCircuitTestCases[1];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[2].name, () => {
		const { input, output } = shouldShortCircuitTestCases[2];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[3].name, () => {
		const { input, output } = shouldShortCircuitTestCases[3];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[4].name, () => {
		const { input, output } = shouldShortCircuitTestCases[4];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[5].name, () => {
		const { input, output } = shouldShortCircuitTestCases[5];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[6].name, () => {
		const { input, output } = shouldShortCircuitTestCases[6];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[7].name, () => {
		const { input, output } = shouldShortCircuitTestCases[7];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[8].name, () => {
		const { input, output } = shouldShortCircuitTestCases[8];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
	test(shouldShortCircuitTestCases[9].name, () => {
		const { input, output } = shouldShortCircuitTestCases[9];
		expect(shouldShortCircuit(input)).toEqual(output);
	});
});
