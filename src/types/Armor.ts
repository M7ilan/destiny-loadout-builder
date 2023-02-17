import {
	EArmorSlotId,
	EArmorStatId,
	EDestinyClassId,
	EElementId,
	EGearTierId,
	EMasterworkAssumption,
	EModCategoryId,
} from './IdEnums';
import { cloneDeep } from 'lodash';

/***** Extra *****/
export const ArmorElementIdList = [
	EElementId.Arc,
	EElementId.Solar,
	EElementId.Void,
	EElementId.Stasis,
];

/********** Armor is all the armor that the user has *********/
// [STORED]: Used to store all the armor that the user has
export type Armor = {
	[EDestinyClassId.Titan]: ArmorGroup;
	[EDestinyClassId.Hunter]: ArmorGroup;
	[EDestinyClassId.Warlock]: ArmorGroup;
};

// Group armor by ArmorSlot
export type ArmorGroup = {
	[EArmorSlotId.Head]: ArmorRaritySplit;
	[EArmorSlotId.Arm]: ArmorRaritySplit;
	[EArmorSlotId.Chest]: ArmorRaritySplit;
	[EArmorSlotId.Leg]: ArmorRaritySplit;
	[EArmorSlotId.ClassItem]: ArmorRaritySplit;
};

// In a lot of places it's convenient to have armor already split out by
// exotic vs nonExotic so we shape our data that way from the start
export type ArmorRaritySplit = {
	exotic: Record<string, ArmorItem>;
	nonExotic: Record<string, ArmorItem>;
};

// Data about each individual piece of armor
export type ArmorItem = {
	// The english display name
	name: string;
	// The path to icon url
	icon: string;
	// Unique id for this particular piece of armor
	id: string;
	// Sum of all base stats
	baseStatTotal: number;
	// Power level
	power: number;
	// List of stats [mobility, resilience, recovery, discipline, intellect, strength]
	stats: StatList;
	// One of [head, arm, chest, leg, classItem]
	armorSlot: EArmorSlotId;
	// Non-unique identifier. For example all 'Necrotic Grip' items will have the same hash
	hash: number;
	// The english display name of the class [titan, warlock, hunter]
	destinyClassName: EDestinyClassId;
	// breakerType: ??? TODO: Do exotics have a breaker type set? I think some should
	// exoticDescription: string TODO: Figure out how to add this
	// Is this armor masterworked
	isMasterworked: boolean;
	// Elemental Affinity
	elementId: EElementId;
	// Exotic, Legendary, Rare, etc...
	gearTierId: EGearTierId;
	isArtifice: boolean;
};

/********** AvailableExoticArmor is all the exotic armor that the user has ***********/
// TODO: Could we do this more cleanly by pulling from the Armor directly? I think this is probably
// fine though. It's a bit more explicit and easier to code with, even if it isn't very DRY.
// [STORED] All available exotic armor
export type AvailableExoticArmor = {
	[EDestinyClassId.Titan]: AvailableExoticArmorGroup;
	[EDestinyClassId.Hunter]: AvailableExoticArmorGroup;
	[EDestinyClassId.Warlock]: AvailableExoticArmorGroup;
};

// Group available exotic armor by ArmorSlot
export type AvailableExoticArmorGroup = {
	[EArmorSlotId.Head]: AvailableExoticArmorItem[];
	[EArmorSlotId.Arm]: AvailableExoticArmorItem[];
	[EArmorSlotId.Chest]: AvailableExoticArmorItem[];
	[EArmorSlotId.Leg]: AvailableExoticArmorItem[];
};

// TODO: I think we only really need the hash here.
// It would be easy enough to look it up on click given that we know
// the selected class and the slot
export type AvailableExoticArmorItem = {
	hash: number;
	name: string;
	count: number;
	icon: string;
	armorSlot: EArmorSlotId;
	destinyClassName: EDestinyClassId;
	// TODO: Maybe this would be an ez way to pre-filter out exotics when
	// there is no masterworked instance of that exotic?
	// hasMasterworkedVariant: boolean
};

/********* Utility functions for generating empty bases to work with **********/
export const generateAvailableExoticArmorGroup =
	(): AvailableExoticArmorGroup => {
		return {
			[EArmorSlotId.Head]: [],
			[EArmorSlotId.Arm]: [],
			[EArmorSlotId.Chest]: [],
			[EArmorSlotId.Leg]: [],
		};
	};

export type ArmorMaxStatsMetadata = Record<
	EArmorStatId,
	{ max: number; withMasterwork: boolean }
>;

export type ArmorCountMaxStatsMetadata = {
	count: number;
	maxStats: ArmorMaxStatsMetadata | null;
};

export type ArmorSlotMetadata = {
	count: number;
	items: Record<EArmorSlotId, ArmorCountMaxStatsMetadata>;
};

export type ArmorMetadataItem = {
	nonExotic: {
		count: number;
		legendary: ArmorSlotMetadata;
		rare: ArmorSlotMetadata;
	};
	exotic: {
		count: number;
		items: Record<EArmorSlotId, Record<string, ArmorMaxStatsMetadata>>;
	};
	artifice: ArmorSlotMetadata;
	raid: {
		count: number;
		items: Partial<Record<EModCategoryId, ArmorSlotMetadata>>;
	};
};

const defaultArmorMaxStatsMetadata: ArmorMaxStatsMetadata = {
	[EArmorStatId.Mobility]: { max: 0, withMasterwork: false },
	[EArmorStatId.Resilience]: { max: 0, withMasterwork: false },
	[EArmorStatId.Recovery]: { max: 0, withMasterwork: false },
	[EArmorStatId.Discipline]: { max: 0, withMasterwork: false },
	[EArmorStatId.Intellect]: { max: 0, withMasterwork: false },
	[EArmorStatId.Strength]: { max: 0, withMasterwork: false },
};

const DefaultArmorSlotMetadata: ArmorSlotMetadata = {
	count: 0,
	items: {
		[EArmorSlotId.Head]: { count: 0, maxStats: null },
		[EArmorSlotId.Arm]: { count: 0, maxStats: null },
		[EArmorSlotId.Chest]: { count: 0, maxStats: null },
		[EArmorSlotId.Leg]: { count: 0, maxStats: null },
		[EArmorSlotId.ClassItem]: { count: 0, maxStats: null },
	},
};

const ArmorMetadataItem: ArmorMetadataItem = {
	nonExotic: {
		count: 0,
		legendary: DefaultArmorSlotMetadata,
		rare: DefaultArmorSlotMetadata,
	},
	exotic: {
		count: 0,
		items: {
			[EArmorSlotId.Head]: {},
			[EArmorSlotId.Arm]: {},
			[EArmorSlotId.Chest]: {},
			[EArmorSlotId.Leg]: {},
			[EArmorSlotId.ClassItem]: {},
		},
	},
	artifice: DefaultArmorSlotMetadata,
	raid: {
		count: 0,
		items: {
			[EModCategoryId.LastWish]: DefaultArmorSlotMetadata,
			[EModCategoryId.GardenOfSalvation]: DefaultArmorSlotMetadata,
			[EModCategoryId.DeepStoneCrypt]: DefaultArmorSlotMetadata,
			[EModCategoryId.VaultOfGlass]: DefaultArmorSlotMetadata,
			[EModCategoryId.VowOfTheDisciple]: DefaultArmorSlotMetadata,
			[EModCategoryId.KingsFall]: DefaultArmorSlotMetadata,
		},
	},
};

export type ArmorMetadata = Record<EDestinyClassId, ArmorMetadataItem>;

const defaultArmorMetadata: ArmorMetadata = {
	[EDestinyClassId.Hunter]: ArmorMetadataItem,
	[EDestinyClassId.Warlock]: ArmorMetadataItem,
	[EDestinyClassId.Titan]: ArmorMetadataItem,
};

export const getDefaultArmorMetadata = () => cloneDeep(defaultArmorMetadata);

export const getDefaultArmorMaxStatsMetadata = () =>
	cloneDeep(defaultArmorMaxStatsMetadata);

// TODO: Maybe do this on a loop over EArmorSlot?
export const generateArmorGroup = (): ArmorGroup => {
	return {
		[EArmorSlotId.Head]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.Arm]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.Chest]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.Leg]: { exotic: {}, nonExotic: {} },
		[EArmorSlotId.ClassItem]: { exotic: {}, nonExotic: {} },
	};
};

/***** Extras  *****/
// TODO: All of this is used in the armor-processing file. Figure out a better home for this stuff

export interface IDestinyItem {
	// Unique identifier for this specific piece of armor.
	id: string;
	// Non-unique identifier. All "Crest of Alpha Lupi" armor pieces will have the same hash.
	hash: number;
}

// "extend" the DestinyItem type
export interface IArmorItem extends IDestinyItem {
	// Mobility, Resilience, Recovery, Discipline, Intellect, Strength
	stats: StatList;
	// Is this piece of armor Exotic, Legendary, etc...
	gearTierId: EGearTierId;
	// Is this piece of armor masterworked
	isMasterworked: boolean;
}

export type StatList = [number, number, number, number, number, number];

// Strictly enforce the length of this array [Heads, Arms, Chests, Legs]
export type StrictArmorItems = [
	IArmorItem[],
	IArmorItem[],
	IArmorItem[],
	IArmorItem[]
];

// We don't export this type... only in this file should we be able to use non-strict armor items
// Otherwise we MUST pass in an array of length 4 for each [Heads, Arms, Chests, Legs]
export type ArmorItems = IArmorItem[];

// Four armor ids [Heads, Arms, Chests, Legs]
export type ArmorIdList = [string, string, string, string];

export interface ISelectedExoticArmor {
	hash: number;
	armorSlot: EArmorSlotId;
}

// Masterworking adds +2 to each stat
export const getExtraMasterworkedStats = (
	{ isMasterworked, gearTierId }: IArmorItem,
	masterworkAssumption: EMasterworkAssumption
) =>
	isMasterworked ||
	(gearTierId === EGearTierId.Exotic &&
		masterworkAssumption === EMasterworkAssumption.All) ||
	(gearTierId === EGearTierId.Legendary &&
		(masterworkAssumption === EMasterworkAssumption.All ||
			masterworkAssumption === EMasterworkAssumption.Legendary))
		? 2
		: 0;
