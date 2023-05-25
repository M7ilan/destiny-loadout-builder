import { Loadout } from '@destinyitemmanager/dim-api-types';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	ArmorSlotEnergyMapping,
	getDefaultArmorSlotEnergyMapping,
} from '@dlb/redux/features/reservedArmorSlotEnergy/reservedArmorSlotEnergySlice';
import {
	ArmorGroup,
	ArmorIdList,
	ArmorItems,
	ArmorMetadataItem,
	AvailableExoticArmorItem,
	ISelectedExoticArmor,
	StatList,
	StrictArmorItems,
} from '@dlb/types/Armor';
import {
	ArmorSlotIdList,
	ArmorSlotWithClassItemIdList,
} from '@dlb/types/ArmorSlot';
import {
	ArmorStatIdList,
	ArmorStatMapping,
	getArmorStatMappingFromMods,
	getDefaultArmorStatMapping,
	sumArmorStatMappings,
} from '@dlb/types/ArmorStat';
import {
	EArmorStatId,
	EDestinyClassId,
	EDimLoadoutsFilterId,
	EGearTierId,
	EMasterworkAssumption,
	ERaidAndNightMareModTypeId,
} from '@dlb/types/IdEnums';
import {
	ArmorSlotIdToModIdListMapping,
	PotentialRaidModArmorSlotPlacement,
} from '@dlb/types/Mod';
import {
	ArmorStatAndRaidModComboPlacement,
	getModCombos,
} from './getModCombos';
import { SeenArmorSlotItems } from './seenArmorSlotItems';
import {
	getArmorStatMappingFromArtificeModIdList,
	getArmorStatMappingFromStatList,
	getExtraSumOfSeenStats,
	getNextValues,
	getSeenArmorSlotItemsFromClassItems,
	getStatListFromArmorStatMapping,
	getTotalModCost,
	getTotalStatTiers,
	getWastedStats,
} from './utils';

const _processArmorRecursiveCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems, ...rest] = armorItems;
	const output: ProcessArmorOutput[] = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const {
			nextSumOfSeenStats,
			nextSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
		} = getNextValues({
			numArmorItems: rest.length,
			seenArmorSlotItems: specialSeenArmorSlotItems,
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption,
		});

		output.push(
			processArmor({
				desiredArmorStats,
				armorItems: rest,
				sumOfSeenStats: nextSumOfSeenStats,
				seenArmorIds: [...seenArmorIds, armorSlotItem.id],
				masterworkAssumption,
				potentialRaidModArmorSlotPlacements,
				armorSlotMods,
				raidMods,
				destinyClassId,
				armorMetadataItem,
				specialSeenArmorSlotItems: nextSpecialSeenArmorSlotItems,
				selectedExotic,
				reservedArmorSlotEnergy,
				useZeroWastedStats,
			})
		);
	});
	// TODO: Can we find a way to not have to do this flattening?
	return output.flat(1);
};

const _processArmorBaseCase = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
}: ProcessArmorParams): ProcessArmorOutput => {
	const [armorSlotItems] = armorItems;
	const output: ProcessArmorOutput = [];
	armorSlotItems.forEach((armorSlotItem) => {
		const {
			nextSumOfSeenStats: finalSumOfSeenStats,
			nextSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
		} = getNextValues({
			numArmorItems: 0,
			seenArmorSlotItems: specialSeenArmorSlotItems,
			sumOfSeenStats,
			armorSlotItem,
			masterworkAssumption,
		});
		const armorIdList = [...seenArmorIds, armorSlotItem.id] as ArmorIdList;

		const modCombos = getModCombos({
			sumOfSeenStats: finalSumOfSeenStats,
			desiredArmorStats,
			potentialRaidModArmorSlotPlacements,
			armorSlotMods,
			raidMods,
			destinyClassId,
			specialSeenArmorSlotItems: finalSpecialSeenArmorSlotItems,
			reservedArmorSlotEnergy,
			useZeroWastedStats,
		});

		if (modCombos === null) {
			return;
		}
		// TODO: Change this based on what the user prioritizes
		const placement = modCombos.lowestCostPlacement;

		const requiredArmorStatModIdList = placement
			? getModIdListFromArmorStatAndRaidModComboPlacement(placement.placement)
			: [];

		const requiredArtificeModIdList = placement
			? placement.artificeModIdList
			: [];

		const baseArmorStatMapping =
			getArmorStatMappingFromStatList(finalSumOfSeenStats);
		const totalArmorStatMapping = sumArmorStatMappings([
			baseArmorStatMapping,
			getArmorStatMappingFromMods(requiredArmorStatModIdList, destinyClassId),
			getArmorStatMappingFromArtificeModIdList(requiredArtificeModIdList),
		]);
		output.push({
			armorIdList,
			armorStatModIdList: requiredArmorStatModIdList,
			artificeModIdList: requiredArtificeModIdList,
			requiredClassItemExtraModSocketCategoryId:
				modCombos.requiredClassItemExtraModSocketCategoryId,
			maximumSingleStatValues: modCombos.maximumSingleStatValues,
			metadata: {
				totalModCost: getTotalModCost(requiredArmorStatModIdList),
				totalStatTiers: getTotalStatTiers(totalArmorStatMapping),
				wastedStats: getWastedStats(totalArmorStatMapping),
				totalArmorStatMapping,
				baseArmorStatMapping,
				seenArmorSlotItems: finalSpecialSeenArmorSlotItems,
			},
		});
	});
	return output;
};

type ProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: ArmorItems[];
	sumOfSeenStats: StatList;
	seenArmorIds: string[];
	masterworkAssumption: EMasterworkAssumption;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
	specialSeenArmorSlotItems: SeenArmorSlotItems;
	selectedExotic: AvailableExoticArmorItem;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	useZeroWastedStats: boolean;
};

const processArmor = ({
	desiredArmorStats,
	armorItems,
	sumOfSeenStats,
	seenArmorIds,
	masterworkAssumption,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	specialSeenArmorSlotItems,
	selectedExotic,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
}: ProcessArmorParams): ProcessArmorOutput => {
	const func =
		armorItems.length === 1
			? _processArmorBaseCase
			: _processArmorRecursiveCase;
	return func({
		desiredArmorStats,
		armorItems,
		sumOfSeenStats,
		seenArmorIds,
		masterworkAssumption,
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		armorMetadataItem,
		specialSeenArmorSlotItems,
		selectedExotic,
		reservedArmorSlotEnergy,
		useZeroWastedStats,
	});
};

export type ProcessedArmorItemMetadata = {
	totalModCost: number;
	totalStatTiers: number;
	wastedStats: number;
	totalArmorStatMapping: ArmorStatMapping;
	baseArmorStatMapping: ArmorStatMapping;
	seenArmorSlotItems: SeenArmorSlotItems;
};

type ProcessArmorOutputItem = {
	armorIdList: ArmorIdList;
	armorStatModIdList: EModId[];
	artificeModIdList: EModId[];
	requiredClassItemExtraModSocketCategoryId: ERaidAndNightMareModTypeId;
	maximumSingleStatValues: Record<EArmorStatId, number>;
	// Anything that the user can sort the results by should be pre-calculated right here
	metadata: ProcessedArmorItemMetadata;
};
export type ProcessArmorOutput = ProcessArmorOutputItem[];

export type DoProcessArmorOutput = {
	items: ProcessArmorOutputItem[];
	totalItemCount: number;
	maxPossibleDesiredStatTiers: ArmorStatMapping;
	maxPossibleReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
};
export type DoProcessArmorParams = {
	desiredArmorStats: ArmorStatMapping;
	armorItems: StrictArmorItems;
	masterworkAssumption: EMasterworkAssumption;
	fragmentArmorStatMapping: ArmorStatMapping;
	modArmorStatMapping: ArmorStatMapping;
	potentialRaidModArmorSlotPlacements: PotentialRaidModArmorSlotPlacement[];
	armorSlotMods: ArmorSlotIdToModIdListMapping;
	raidMods: EModId[];
	destinyClassId: EDestinyClassId;
	armorMetadataItem: ArmorMetadataItem;
	selectedExotic: AvailableExoticArmorItem;
	reservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	useZeroWastedStats: boolean;
};
/**
 * @param {ArmorItems2} armorItems - [heads, arms, chests, legs]
 * @returns {ProcessArmorOutput} All the combinations of armor ids that meet the required specs
 * @description This function expects that every combination of [heads, arms, chests, legs]
 * is valid.
 */
export const doProcessArmor = ({
	desiredArmorStats,
	armorItems,
	masterworkAssumption,
	fragmentArmorStatMapping,
	modArmorStatMapping,
	potentialRaidModArmorSlotPlacements,
	armorSlotMods,
	raidMods,
	destinyClassId,
	armorMetadataItem,
	selectedExotic,
	reservedArmorSlotEnergy,
	useZeroWastedStats,
}: DoProcessArmorParams): DoProcessArmorOutput => {
	// Add in the class item
	const extraSumOfSeenStats = getExtraSumOfSeenStats(
		fragmentArmorStatMapping,
		modArmorStatMapping
	);
	let sumOfSeenStats = [...extraSumOfSeenStats];
	// TODO: This logic won't work well with the logic that checks
	// for the necessary class item mod socket category. If we have
	// an unmasterworked raid class item that we need then this will assume
	// that the class item is masterworked which is no bueno.
	if (
		armorMetadataItem.classItem.hasMasterworkedLegendaryClassItem ||
		(masterworkAssumption !== EMasterworkAssumption.None &&
			armorMetadataItem.classItem.hasLegendaryClassItem)
	) {
		sumOfSeenStats = sumOfSeenStats.map((x) => x + 2);
	}

	const seenArmorSlotItems =
		getSeenArmorSlotItemsFromClassItems(armorMetadataItem);
	const processArmorParams: ProcessArmorParams = {
		masterworkAssumption,
		desiredArmorStats,
		armorItems,
		sumOfSeenStats: sumOfSeenStats as StatList,
		seenArmorIds: [],
		potentialRaidModArmorSlotPlacements,
		armorSlotMods,
		raidMods,
		destinyClassId,
		armorMetadataItem,
		specialSeenArmorSlotItems: seenArmorSlotItems,
		selectedExotic,
		reservedArmorSlotEnergy,
		useZeroWastedStats,
	};

	const processedArmor: ProcessArmorOutput = processArmor(processArmorParams);

	// // TODO: Both of these (maxPossibleDesiredStatTiers and maxPossibleReservedArmorSlotEnergy) loop over the same set of results.
	// // Combine these functions to only loop once
	// const maxPossibleDesiredStatTiers = getMaxPossibleDesiredStatTiers({
	// 	processedArmor,
	// 	processArmorParams,
	// });

	// const maxPossibleReservedArmorSlotEnergy = getMaxPossibleReservedArmorEnergy({
	// 	processedArmor,
	// 	processArmorParams,
	// });

	const {
		maxReservedArmorSlotEnergy: maxPossibleReservedArmorSlotEnergy,
		maxStatTiers: maxPossibleDesiredStatTiers,
	} = getMaxPossibleMetadata({
		processedArmor,
		processArmorParams,
	});

	const totalItemCount = processedArmor.length;
	// Pick the first 1k items. Keeps the storage in redux lower
	// and speeds up the app
	const elemsToDelete = Math.max(processedArmor.length - 1000, 0);
	processedArmor.splice(processedArmor.length - elemsToDelete, elemsToDelete);

	return {
		items: processedArmor,
		totalItemCount,
		maxPossibleDesiredStatTiers,
		maxPossibleReservedArmorSlotEnergy,
	};
};

export type GetMaxPossibleDesiredStatTiersParams = {
	processedArmor: ProcessArmorOutput;
	processArmorParams: ProcessArmorParams;
};

export const getMaxPossibleMetadata = ({
	processedArmor,
	processArmorParams,
}: GetMaxPossibleDesiredStatTiersParams): {
	maxReservedArmorSlotEnergy: ArmorSlotEnergyMapping;
	maxStatTiers: ArmorStatMapping;
} => {
	const maxReservedArmorSlotEnergy: ArmorSlotEnergyMapping =
		getDefaultArmorSlotEnergyMapping();
	const maxStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
	if (processedArmor.length === 0) {
		return { maxReservedArmorSlotEnergy, maxStatTiers };
	}

	const { desiredArmorStats } = processArmorParams;
	const { reservedArmorSlotEnergy } = processArmorParams;
	let processedArmorSlotCount = 0;
	let processedArmorStatCount = 0;

	const unprocessedArmorStatIds = [...ArmorStatIdList];
	const unprocessedArmorSlotIds = [...ArmorSlotWithClassItemIdList];

	let totalIterations = 0;
	let armorSlotIterations = 0;
	let armorStatIterations = 0;
	for (let i = 10; i > 0; i--) {
		for (let j = 0; j < processedArmor.length; j++) {
			for (let k = 0; k < unprocessedArmorSlotIds.length; k++) {
				totalIterations++;
				armorSlotIterations++;
				let hasCombo = false;
				const armorSlotId = unprocessedArmorSlotIds[k];
				const reservedArmorSlotEnergyValue = i;
				const _reservedArmorSlotEnergy = {
					...reservedArmorSlotEnergy,
					[armorSlotId]: reservedArmorSlotEnergyValue,
				};
				hasCombo =
					getModCombos({
						sumOfSeenStats: getStatListFromArmorStatMapping(
							processedArmor[j].metadata.baseArmorStatMapping
						),
						desiredArmorStats: processArmorParams.desiredArmorStats,
						potentialRaidModArmorSlotPlacements:
							processArmorParams.potentialRaidModArmorSlotPlacements,
						armorSlotMods: processArmorParams.armorSlotMods,
						raidMods: processArmorParams.raidMods,
						destinyClassId: processArmorParams.destinyClassId,
						specialSeenArmorSlotItems:
							processedArmor[j].metadata.seenArmorSlotItems,
						reservedArmorSlotEnergy: _reservedArmorSlotEnergy,
						useZeroWastedStats: processArmorParams.useZeroWastedStats,
					}) !== null;
				if (hasCombo) {
					maxReservedArmorSlotEnergy[armorSlotId] =
						reservedArmorSlotEnergyValue;
					processedArmorSlotCount++;
					unprocessedArmorSlotIds.splice(k, 1);
					k--;
				}
			}

			for (let k = 0; k < unprocessedArmorStatIds.length; k++) {
				totalIterations++;
				armorStatIterations++;
				let hasCombo = false;
				const armorStatId = unprocessedArmorStatIds[k];
				const desiredStat = i * 10;
				const _desiredArmorStats = {
					...desiredArmorStats,
					[armorStatId]: desiredStat,
				};
				hasCombo =
					getModCombos({
						sumOfSeenStats: getStatListFromArmorStatMapping(
							processedArmor[j].metadata.baseArmorStatMapping
						),
						desiredArmorStats: _desiredArmorStats,
						potentialRaidModArmorSlotPlacements:
							processArmorParams.potentialRaidModArmorSlotPlacements,
						armorSlotMods: processArmorParams.armorSlotMods,
						raidMods: processArmorParams.raidMods,
						destinyClassId: processArmorParams.destinyClassId,
						specialSeenArmorSlotItems:
							processedArmor[j].metadata.seenArmorSlotItems,
						reservedArmorSlotEnergy: processArmorParams.reservedArmorSlotEnergy,
						useZeroWastedStats: processArmorParams.useZeroWastedStats,
					}) !== null;
				if (hasCombo) {
					maxStatTiers[armorStatId] = desiredStat;
					processedArmorStatCount++;
					unprocessedArmorStatIds.splice(k, 1);
					k--;
				}
			}
		}

		// Done after finding a combo that works for every armor slot and every armor stat
		if (
			processedArmorSlotCount === ArmorSlotWithClassItemIdList.length &&
			processedArmorStatCount === ArmorStatIdList.length
		) {
			console.log('>>> break', totalIterations);
			break;
		}
	}
	console.log('>>> iterations', {
		totalIterations,
		armorSlotIterations,
		armorStatIterations,
	});
	return { maxReservedArmorSlotEnergy, maxStatTiers };
};

// Transform the shape of the application's armor to be processed.
// Filter out any armor items that will definitely not be used.
export const preProcessArmor = (
	armorGroup: ArmorGroup,
	selectedExoticArmor: ISelectedExoticArmor,
	dimLoadouts: Loadout[],
	dimLoadoutsFilterId: EDimLoadoutsFilterId,
	minimumGearTier: EGearTierId
): StrictArmorItems => {
	const excludedItemIds: Record<string, boolean> = {};
	if (dimLoadoutsFilterId === EDimLoadoutsFilterId.None) {
		dimLoadouts.forEach((loadout) =>
			loadout.equipped.forEach((equipped) => {
				excludedItemIds[equipped.id] = true;
			})
		);
	}

	const strictArmorItems: StrictArmorItems = [[], [], [], []];
	ArmorSlotIdList.forEach((armorSlot, i) => {
		if (armorSlot === selectedExoticArmor.armorSlot) {
			strictArmorItems[i] = Object.values(armorGroup[armorSlot].exotic).filter(
				(item) =>
					!excludedItemIds[item.id] && item.hash === selectedExoticArmor.hash
			);
			return;
		}
		strictArmorItems[i] = Object.values(armorGroup[armorSlot].nonExotic).filter(
			(item) => {
				// TODO: Write a better comparator for gear tiers
				if (
					item.gearTierId === EGearTierId.Uncommon ||
					item.gearTierId === EGearTierId.Common ||
					item.gearTierId === EGearTierId.Unknown
				) {
					return false;
				}
				// TODO: If the gear tier selector ever allows lower than blue this will need to be changed
				if (
					minimumGearTier === EGearTierId.Legendary &&
					item.gearTierId !== EGearTierId.Legendary
				) {
					return false;
				}
				return !excludedItemIds[item.id];
			}
		);
	});
	return strictArmorItems;
};

const getModIdListFromArmorStatAndRaidModComboPlacement = (
	placement: ArmorStatAndRaidModComboPlacement
): EModId[] => {
	const result: EModId[] = [];
	ArmorSlotWithClassItemIdList.forEach((armorSlot) => {
		const modId = placement[armorSlot].armorStatModId;
		if (!modId) {
			return;
		}
		result.push(modId);
	});
	return result;
};

// Iterate over the existing results to figure out what tiers we can achieve
type GetMaxPossibleDesiredStatTiers = {
	processedArmor: ProcessArmorOutput;
	processArmorParams: ProcessArmorParams;
};
export const getMaxPossibleDesiredStatTiers = ({
	processedArmor,
	processArmorParams,
}: GetMaxPossibleDesiredStatTiers): ArmorStatMapping => {
	const maximumStatTiers: ArmorStatMapping = getDefaultArmorStatMapping();
	if (processedArmor.length === 0) {
		return maximumStatTiers;
	}
	const { desiredArmorStats } = processArmorParams;

	ArmorStatIdList.forEach((armorStatId) => {
		for (let i = 10; i > 0; i--) {
			const desiredStat = i * 10;
			const _desiredArmorStats = {
				...desiredArmorStats,
				[armorStatId]: desiredStat,
			};
			let hasCombo = false;
			for (let j = 0; j < processedArmor.length; j++) {
				hasCombo =
					getModCombos({
						sumOfSeenStats: getStatListFromArmorStatMapping(
							processedArmor[j].metadata.baseArmorStatMapping
						),
						desiredArmorStats: _desiredArmorStats,
						potentialRaidModArmorSlotPlacements:
							processArmorParams.potentialRaidModArmorSlotPlacements,
						armorSlotMods: processArmorParams.armorSlotMods,
						raidMods: processArmorParams.raidMods,
						destinyClassId: processArmorParams.destinyClassId,
						specialSeenArmorSlotItems:
							processedArmor[j].metadata.seenArmorSlotItems,
						reservedArmorSlotEnergy: processArmorParams.reservedArmorSlotEnergy,
						useZeroWastedStats: processArmorParams.useZeroWastedStats,
					}) !== null;
				if (hasCombo) {
					maximumStatTiers[armorStatId] = desiredStat;
					break;
				}
			}
			if (hasCombo) {
				break;
			}
		}
	});
	return maximumStatTiers;
};

// Iterate over the existing results to figure out what tiers we can achieve
type GetMaxReservedArmorEnergy = {
	processedArmor: ProcessArmorOutput;
	processArmorParams: ProcessArmorParams;
};
export const getMaxPossibleReservedArmorEnergy = ({
	processedArmor,
	processArmorParams,
}: GetMaxReservedArmorEnergy): ArmorSlotEnergyMapping => {
	const maximumReservedArmorSlotEnergy: ArmorSlotEnergyMapping =
		getDefaultArmorSlotEnergyMapping();
	if (processedArmor.length === 0) {
		return maximumReservedArmorSlotEnergy;
	}
	const { reservedArmorSlotEnergy } = processArmorParams;

	ArmorSlotWithClassItemIdList.forEach((armorSlotId) => {
		for (let i = 10; i > 0; i--) {
			// if (
			// 	i === 10 &&
			// 	processArmorParams.armorSlotMods[EArmorSlotId.Head].findIndex(
			// 		(x) => x === null
			// 	) === -1
			// ) {
			// 	debugger;
			// }
			const testReservedArmorSlotEnergyValue = i;
			const _reservedArmorSlotEnergy = {
				...reservedArmorSlotEnergy,
				[armorSlotId]: testReservedArmorSlotEnergyValue,
			};
			let hasCombo = false;
			for (let j = 0; j < processedArmor.length; j++) {
				hasCombo =
					getModCombos({
						sumOfSeenStats: getStatListFromArmorStatMapping(
							processedArmor[j].metadata.baseArmorStatMapping
						),
						desiredArmorStats: processArmorParams.desiredArmorStats,
						potentialRaidModArmorSlotPlacements:
							processArmorParams.potentialRaidModArmorSlotPlacements,
						armorSlotMods: processArmorParams.armorSlotMods,
						raidMods: processArmorParams.raidMods,
						destinyClassId: processArmorParams.destinyClassId,
						specialSeenArmorSlotItems:
							processedArmor[j].metadata.seenArmorSlotItems,
						reservedArmorSlotEnergy: _reservedArmorSlotEnergy,
						useZeroWastedStats: processArmorParams.useZeroWastedStats,
					}) !== null;
				if (hasCombo) {
					maximumReservedArmorSlotEnergy[armorSlotId] =
						testReservedArmorSlotEnergyValue;
					break;
				}
			}
			if (hasCombo) {
				break;
			}
		}
	});
	return maximumReservedArmorSlotEnergy;
};