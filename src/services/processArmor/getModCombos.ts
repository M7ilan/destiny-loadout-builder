import { EModId } from '@dlb/generated/mod/EModId';
import { ArmorSlotEnergyMapping } from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import { AllClassItemMetadata, StatList } from '@dlb/types/Armor';
import { ArmorSlotWithClassItemIdList } from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatModSpitFromArmorStatId,
} from '@dlb/types/ArmorStat';
import { EArmorSlotId, EDestinyClassId } from '@dlb/types/IdEnums';
import {
	ArmorSlotCapacity,
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
	getArmorSlotEnergyCapacity,
	getMod,
} from '@dlb/types/Mod';
import { cloneDeep } from 'lodash';
import { EXTRA_MASTERWORK_STAT_LIST } from './constants';
import { filterPotentialRaidModArmorSlotPlacements } from './filterPotentialRaidModArmorSlotPlacements';
import {
	StatModCombo,
	getDefaultStatModCombo,
	getStatModCombosFromDesiredStats,
} from './getStatModCombosFromDesiredStats';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	RequiredClassItemMetadataKey,
	getItemCountsFromSeenArmorSlotItems,
	sumModCosts,
	sumStatLists,
} from './utils';

/***** ArmorSlotModComboPlacementWithArtificeMods *****/
export type ArmorStatAndRaidModComboPlacementValue = {
	armorStatModId: EModId;
	raidModId: EModId;
};

export type ArmorStatAndRaidModComboPlacement = Record<
	EArmorSlotId,
	ArmorStatAndRaidModComboPlacementValue
>;

export type ModPlacement = {
	placement: ArmorStatAndRaidModComboPlacement;
	artificeModIdList: EModId[];
};

export const getDefaultModPlacements = (): ModPlacement => ({
	placement: {
		[EArmorSlotId.Head]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.Arm]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.Chest]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.Leg]: { armorStatModId: null, raidModId: null },
		[EArmorSlotId.ClassItem]: { armorStatModId: null, raidModId: null },
	},
	artificeModIdList: [],
});

export const getDefaultArmorSlotModComboPlacementWithArtificeMods =
	(): ModPlacement => {
		return {
			placement: {
				[EArmorSlotId.Head]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.Arm]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.Chest]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.Leg]: {
					armorStatModId: null,
					raidModId: null,
				},
				[EArmorSlotId.ClassItem]: {
					armorStatModId: null,
					raidModId: null,
				},
			},
			artificeModIdList: [],
		};
	};

/***** ModComboArmorSlotMetadata *****/
export type ModComboArmorSlotMetadata = Record<
	EArmorSlotId,
	{
		minUnusedArmorEnergy: number;
		maxUnusedArmorEnergy: number;
	}
>;

export const getDefaultModComboArmorSlotMetadata =
	(): ModComboArmorSlotMetadata => {
		const metadata: ModComboArmorSlotMetadata = {
			[EArmorSlotId.Head]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.Arm]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.Chest]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.Leg]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
			[EArmorSlotId.ClassItem]: {
				minUnusedArmorEnergy: 0,
				maxUnusedArmorEnergy: Infinity,
			},
		};
		return metadata;
	};

/***** ModCombos *****/
export type ModCombos = {
	armorSlotMetadata: ModComboArmorSlotMetadata;
	lowestCostPlacement: ModPlacement;
	requiredClassItemMetadataKey: RequiredClassItemMetadataKey;
	hasMasterworkedClassItem: boolean;
	// TODO: fewestWastedStatsPlacement: ModPlacement;
	// TODO: mostStatTiersPlacement: ModPlacement;
};

export const getDefaultModCombos = (): ModCombos => ({
	armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
	lowestCostPlacement: {
		artificeModIdList: [],
		placement: {
			[EArmorSlotId.Arm]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.Chest]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.ClassItem]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.Head]: {
				armorStatModId: null,
				raidModId: null,
			},
			[EArmorSlotId.Leg]: {
				armorStatModId: null,
				raidModId: null,
			},
		},
	},
	requiredClassItemMetadataKey: null,
	hasMasterworkedClassItem: false,
});

export type GetModCombosParams = {
	sumOfSeenStats: StatList;
	desiredArmorStats: ArmorStatMapping;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	useZeroWastedStats: boolean;
	allClassItemMetadata: AllClassItemMetadata;
};

export const getModCombos = (params: GetModCombosParams): ModCombos => {
	const {
		sumOfSeenStats,
		desiredArmorStats,
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		specialSeenArmorSlotItems,
		reservedArmorSlotEnergy,
		useZeroWastedStats,
		allClassItemMetadata,
	} = params;

	// First sanity check the armorSlotMods against the reserved armorSlotEnergy
	// TODO: For some reason getFirstValidStatModCombo won't catch this case
	// So as a hack I'm doing it here for now...
	for (const armorSlotId of ArmorSlotWithClassItemIdList) {
		if (
			sumModCosts(armorSlotMods[armorSlotId]) +
				reservedArmorSlotEnergy[armorSlotId] >
			10
		) {
			return null;
		}
	}

	const seenItemCounts = getItemCountsFromSeenArmorSlotItems(
		specialSeenArmorSlotItems
	);
	let seenArtificeCount = seenItemCounts.Artifice;

	let requiredClassItemMetadataKey: RequiredClassItemMetadataKey = null;

	let filteredPotentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[] =
		null;

	let _sumOfSeenStats: StatList = [...sumOfSeenStats];

	// TODO: Cache this result
	if (raidMods.length > 0) {
		// Filter the potential raid mod placemnts down to the placements that
		// have a chance at actually working for this specific armor cobmination
		const potentialRaidModPlacements =
			filterPotentialRaidModArmorSlotPlacements({
				potentialRaidModArmorSlotPlacements,
				raidMods,
				specialSeenArmorSlotItems,
				allClassItemMetadata,
			});
		// We have nowhere to put raid mods
		if (!potentialRaidModPlacements?.potentialPlacements) {
			return null;
		}
		const {
			potentialPlacements: _raidModArmorSlotPlacements,
			requiredClassItemMetadataKey: _requiredClassItemMetadataKey,
		} = potentialRaidModPlacements;

		if (_raidModArmorSlotPlacements.length === 0) {
			return null;
		}

		filteredPotentialRaidModArmorSlotPlacements = _raidModArmorSlotPlacements;
		requiredClassItemMetadataKey = _requiredClassItemMetadataKey;
	}

	let hasMasterworkedClassItem = false;
	// We can use artifice class items if we don't need a special kind of class item
	// TODO: We need to be careful in the case where the user does not have a masterworked artifice class item
	// and they have turned off the legendary masterwork assumption. It may be more beneficial
	// to use a standard masterworked legendary class item over an unmasterworked artifice class item.
	// The current logic here is bad. We probably need to check both cases and return each
	// as a different result if both have valid mod combos.
	if (requiredClassItemMetadataKey === null) {
		if (allClassItemMetadata.Artifice.items.length > 0) {
			seenArtificeCount++;
			if (allClassItemMetadata.Artifice.hasMasterworkedVariant) {
				hasMasterworkedClassItem = true;
				_sumOfSeenStats = sumStatLists([
					sumOfSeenStats,
					EXTRA_MASTERWORK_STAT_LIST,
				]);
			}
		} else {
			if (allClassItemMetadata.Legendary.hasMasterworkedVariant) {
				hasMasterworkedClassItem = true;
				_sumOfSeenStats = sumStatLists([
					sumOfSeenStats,
					EXTRA_MASTERWORK_STAT_LIST,
				]);
			}
		}
	} else if (
		allClassItemMetadata[requiredClassItemMetadataKey].hasMasterworkedVariant
	) {
		hasMasterworkedClassItem = true;
		_sumOfSeenStats = sumStatLists([
			sumOfSeenStats,
			EXTRA_MASTERWORK_STAT_LIST,
		]);
	}

	// Get all the stat mod combos which get us to the desiredArmorStats
	// TODO: Cache this result
	const statModCombos = getStatModCombosFromDesiredStats({
		currentStats: _sumOfSeenStats,
		targetStats: desiredArmorStats,
		numArtificeItems: seenArtificeCount,
		useZeroWastedStats,
	});

	if (statModCombos === null) {
		return null;
	}

	const lowestCostPlacement =
		getDefaultArmorSlotModComboPlacementWithArtificeMods();

	const { isValid, combo, placementCapacity } = getFirstValidStatModCombo({
		statModComboList: statModCombos,
		potentialRaidModArmorSlotPlacements:
			filteredPotentialRaidModArmorSlotPlacements,
		armorSlotMods,
		reservedArmorSlotEnergy,
	});

	if (!isValid) {
		return null;
	}

	if (combo) {
		const expandedCombo = convertStatModComboToExpandedStatModCombo(combo);
		expandedCombo.armorStatModIdList.forEach((modId, i) => {
			lowestCostPlacement.placement[
				ArmorSlotWithClassItemIdList[i]
			].armorStatModId = modId;
		});
		// placementCapacity.forEach((placement, i) => {
		// 	lowestCostPlacement.placement[
		// 		placement.armorSlotId
		// 	].armorStatModId = placement.;
		// })
		lowestCostPlacement.artificeModIdList = expandedCombo.artificeModIdList;
	}

	// TODO: Two more steps
	// 1. Get the desired stat preview. Binary search increased desired stat tiers for each stat
	//    Make sure to cache the highest seen natural stat tier for each stat to make
	//    this faster
	// 2. Get the armor slot mod preview. Use existing desired stat tiers
	//    to binary search reserved armor energy for each armor slot

	const result: ModCombos = {
		armorSlotMetadata: getDefaultModComboArmorSlotMetadata(),
		lowestCostPlacement,
		requiredClassItemMetadataKey,
		hasMasterworkedClassItem,
	};

	return result;
};

type AgnosticModPlacement = Record<
	EArmorSlotId,
	{ armorStatModId: EModId; raidModId: EModId }
>;

type GetFirstValidStatModComboParams = {
	statModComboList: StatModCombo[];
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};

type GetFirstValidStatModComboResult = {
	isValid: boolean;
	combo: StatModCombo;
	placementCapacity: ArmorSlotCapacity[];
};

// Pick the first combo that has a valid placement
const getFirstValidStatModCombo = ({
	statModComboList,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	reservedArmorSlotEnergy,
}: GetFirstValidStatModComboParams): GetFirstValidStatModComboResult => {
	if (
		statModComboList.length === 0 &&
		(potentialRaidModArmorSlotPlacements === null ||
			potentialRaidModArmorSlotPlacements.length == 0)
	) {
		return { isValid: true, combo: null, placementCapacity: null };
	}

	const armorSlotCapacities = getArmorSlotCapacities({
		armorSlotMods,
		potentialRaidModArmorSlotPlacements,
		reservedArmorSlotEnergy,
	});

	const allSortedCapacities: ArmorSlotCapacity[][] = [];
	for (let j = 0; j < armorSlotCapacities.length; j++) {
		const capacity = armorSlotCapacities[j];
		const sortedArmorSlotCapacities = Object.values(capacity).sort(
			// Sort by capacity then by name. By name is just for making consistent testing easier
			(a, b) =>
				b.capacity - a.capacity || a.armorSlotId.localeCompare(b.armorSlotId)
		);
		allSortedCapacities.push(sortedArmorSlotCapacities);
	}

	let _statModComboList = [...statModComboList];

	// This edge case is when we have raid mods but no stat mods are necessary
	if (_statModComboList.length === 0) {
		_statModComboList = [getDefaultStatModCombo()];
	}
	for (let i = 0; i < _statModComboList.length; i++) {
		const { armorStatModIdList } = convertStatModComboToExpandedStatModCombo(
			_statModComboList[i]
		);
		const sortedArmorStatMods = [...armorStatModIdList].sort(
			(a, b) => getMod(b).cost - getMod(a).cost
		);

		for (let j = 0; j < allSortedCapacities.length; j++) {
			const capacity = allSortedCapacities[j];
			if (
				hasValidModPlacement({
					sortedArmorStatMods,
					sortedArmorSlotCapacities: capacity,
				})
			) {
				const placementCapacity = cloneDeep(capacity);
				sortedArmorStatMods.forEach((modId, k) => {
					placementCapacity[k].armorStatModId = modId;
				});
				return {
					isValid: true,
					combo: _statModComboList[i],
					placementCapacity,
				};
			}
		}
	}
	return { isValid: false, combo: null, placementCapacity: null };
};

export type ExpandedStatModCombo = {
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
};

// Use the counts to generate lists of mods to permute
export const convertStatModComboToExpandedStatModCombo = (
	combo: StatModCombo
): ExpandedStatModCombo => {
	const expandedCombo: ExpandedStatModCombo = {
		armorStatModIdList: [],
		artificeModIdList: [],
	};
	ArmorStatIdList.forEach((armorStatId) => {
		if (!combo[armorStatId]) {
			return;
		}
		const { numArtificeMods, numMajorMods, numMinorMods } = combo[armorStatId];
		const split = getArmorStatModSpitFromArmorStatId(armorStatId);
		for (let i = 0; i < numArtificeMods; i++) {
			expandedCombo.artificeModIdList.push(split.artifice);
		}
		for (let i = 0; i < numMajorMods; i++) {
			expandedCombo.armorStatModIdList.push(split.major);
		}
		for (let i = 0; i < numMinorMods; i++) {
			expandedCombo.armorStatModIdList.push(split.minor);
		}
	});
	return expandedCombo;
};

type HasValidModPlacementParams = {
	sortedArmorStatMods: EModId[];
	sortedArmorSlotCapacities: ArmorSlotCapacity[];
};

// Put the highest cost mod in the highest capacity slot
// Put the second highest cost mod in the second highest capacity slot, etc...
export const hasValidModPlacement = ({
	sortedArmorStatMods,
	sortedArmorSlotCapacities,
}: HasValidModPlacementParams): boolean => {
	let isValid = true;
	for (let i = 0; i < sortedArmorStatMods.length; i++) {
		if (
			getMod(sortedArmorStatMods[i]).cost >
			sortedArmorSlotCapacities[i].capacity
		) {
			isValid = false;
			break;
		}
	}
	return isValid;
};

export type GetArmorSlotCapacitiesParams = {
	potentialRaidModArmorSlotPlacements:
		| PotentialRaidModArmorSlotPlacement[]
		| null;
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};
export const getArmorSlotCapacities = ({
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	reservedArmorSlotEnergy,
}: GetArmorSlotCapacitiesParams): Record<EArmorSlotId, ArmorSlotCapacity>[] => {
	const hasRaidMods = potentialRaidModArmorSlotPlacements?.length > 0;
	let allArmorSlotCapacities = [getArmorSlotEnergyCapacity(armorSlotMods)];
	if (hasRaidMods) {
		allArmorSlotCapacities = [];
		for (let i = 0; i < potentialRaidModArmorSlotPlacements.length; i++) {
			const armorSlotCapacities = getArmorSlotEnergyCapacity(armorSlotMods);
			const raidModPlacement = potentialRaidModArmorSlotPlacements[i];
			let isValid = true;
			// Update the armorSlotCapacities for this particular raid mod placement permutation
			for (let j = 0; j < ArmorSlotWithClassItemIdList.length; j++) {
				const armorSlotId = ArmorSlotWithClassItemIdList[j];
				const newCapacity =
					armorSlotCapacities[armorSlotId].capacity -
					(raidModPlacement[armorSlotId]
						? getMod(raidModPlacement[armorSlotId]).cost
						: 0) -
					reservedArmorSlotEnergy[armorSlotId];
				if (newCapacity < 0) {
					isValid = false;
					break;
				}
				armorSlotCapacities[armorSlotId].capacity = newCapacity;
				armorSlotCapacities[armorSlotId].raidModId =
					raidModPlacement[armorSlotId];
			}
			if (isValid) {
				allArmorSlotCapacities.push(armorSlotCapacities);
			}
		}
	} else {
		for (let i = 0; i < ArmorSlotWithClassItemIdList.length; i++) {
			const armorSlotId = ArmorSlotWithClassItemIdList[i];
			if (reservedArmorSlotEnergy[armorSlotId] === 0) {
				continue;
			}
			for (let j = 0; j < allArmorSlotCapacities.length; j++) {
				allArmorSlotCapacities[j][armorSlotId].capacity -=
					reservedArmorSlotEnergy[armorSlotId];
			}
		}
	}

	return allArmorSlotCapacities;
};
