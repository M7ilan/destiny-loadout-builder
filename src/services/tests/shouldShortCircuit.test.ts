import {
	shouldShortCircuit,
	ShouldShortCircuitOutput,
	ShouldShortCircuitParams,
} from '@dlb/services/armor-processing';
import { describe, expect, test } from '@jest/globals';
import { enforceValidLegendaryArmorBaseStats as es } from '@dlb/services/test-utils';
import {
	EArmorStatId,
	EArmorSlotId,
	EArmorStatModId,
} from '@dlb/types/IdEnums';

type ShouldShortCircuitTestCase = {
	name: string;
	input: ShouldShortCircuitParams;
	output: ShouldShortCircuitOutput;
};

const shouldShortCircuitTestCases: ShouldShortCircuitTestCase[] = [
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
		},
		output: [
			true,
			[
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MajorMobility,
				EArmorStatModId.MinorMobility,
			],
			{
				[EArmorStatId.Mobility]: 65,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			null,
			EArmorSlotId.Chest,
		],
	},
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
		},
		output: [
			false,
			[
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MinorStrength,
			],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 35,
			},
			null,
			null,
		],
	},
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
		},
		output: [
			true,
			[
				EArmorStatModId.MajorDiscipline,
				EArmorStatModId.MajorDiscipline,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MinorStrength,
			],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 20,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 35,
			},
			null,
			EArmorSlotId.Arm,
		],
	},
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
		},
		output: [
			true,
			[
				EArmorStatModId.MinorDiscipline,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MajorStrength,
				EArmorStatModId.MinorStrength,
			],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 5,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 55,
			},
			null,
			EArmorSlotId.Head,
		],
	},
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
		},
		output: [
			false,
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
	},
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
		},
		output: [
			false,
			[],
			{
				[EArmorStatId.Mobility]: 0,
				[EArmorStatId.Resilience]: 0,
				[EArmorStatId.Recovery]: 0,
				[EArmorStatId.Discipline]: 0,
				[EArmorStatId.Intellect]: 0,
				[EArmorStatId.Strength]: 0,
			},
			null,
			null,
		],
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
});