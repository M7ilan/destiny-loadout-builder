import {
	EArmorSlotId,
	EDestinyClassId,
	EElementId,
	EMasterworkAssumption,
} from './IdEnums';

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
	// Is this piece of armor exotic
	isExotic: boolean;
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
	// Is this piece of armor an exotic
	isExotic: boolean;
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
	{ isMasterworked, isExotic }: IArmorItem,
	masterworkAssumption: EMasterworkAssumption
) =>
	isMasterworked ||
	(isExotic && masterworkAssumption === EMasterworkAssumption.All) ||
	// TODO: This is a bug. It will assume that blue, green and white gear can be masterworked
	(!isExotic &&
		(masterworkAssumption === EMasterworkAssumption.All ||
			masterworkAssumption === EMasterworkAssumption.Legendary))
		? 2
		: 0;