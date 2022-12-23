import { Loadout, LoadoutParameters } from '@destinyitemmanager/dim-api-types';
import {
	EArmorStatId,
	EArmorStatModId,
	EAspectId,
	ECombatStyleModId,
	EDestinyClassId,
	EDestinySubclassId,
	EFragmentId,
	EMasterworkAssumption,
} from '@dlb/types/IdEnums';
import { getFragment } from '@dlb/types/Fragment';
import { getArmorStatMod } from '@dlb/types/ArmorStatMod';
import { ArmorStatMapping, getArmorStat } from '@dlb/types/ArmorStat';
import { DestinyClassIdToDestinyClassHash } from '@dlb/types/External';
import { AvailableExoticArmorItem, IArmorItem } from '@dlb/types/Armor';
import { getDestinySubclass } from '@dlb/types/DestinySubclass';
import { getCombatStyleMod } from '@dlb/types/CombatStyleMod';
import { getAspect } from '@dlb/types/Aspect';
import { EJumpId } from '@dlb/generated/jump/EJumpId';
import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import { EMeleeId } from '@dlb/generated/melee/EMeleeId';
import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import { getClassAbility } from '@dlb/types/ClassAbility';
import { EClassAbilityId } from '@dlb/generated/classAbility/EClassAbilityId';
import { getSuperAbility } from '@dlb/types/SuperAbility';
import { getJump } from '@dlb/types/Jump';
import { getMelee } from '@dlb/types/Melee';
import { getGrenade } from '@dlb/types/Grenade';

export type DimLoadoutConfiguration = {
	modIdList: ECombatStyleModId[];
	fragmentIdList: EFragmentId[];
	aspectIdList: EAspectId[];
	jumpId: EJumpId;
	grenadeId: EGrenadeId;
	meleeId: EMeleeId;
	classAbilityId: EClassAbilityId;
	superAbilityId: ESuperAbilityId;
	armorStatModIdList: EArmorStatModId[];
	exoticArmor: AvailableExoticArmorItem;
	stats: ArmorStatMapping;
	masterworkAssumption: EMasterworkAssumption;
	destinySubclassId: EDestinySubclassId;
	destinyClassId: EDestinyClassId;
	armorList: IArmorItem[];
};

export const generateDimLink = (
	configuration: DimLoadoutConfiguration
): string => {
	const {
		modIdList,
		fragmentIdList,
		aspectIdList,
		armorStatModIdList,
		exoticArmor,
		stats,
		masterworkAssumption,
		destinyClassId,
		destinySubclassId,
		armorList,
		jumpId,
		meleeId,
		classAbilityId,
		grenadeId,
		superAbilityId,
	} = configuration;
	const fragmentHashes: number[] = fragmentIdList.map(
		(fragmentId: EFragmentId) => getFragment(fragmentId).hash
	);
	const modHashes: number[] = modIdList.map(
		(modId: ECombatStyleModId) => getCombatStyleMod(modId).hash
	);
	const aspectHashes: number[] = aspectIdList.map(
		(aspectId: EAspectId) => getAspect(aspectId).hash
	);
	armorStatModIdList.forEach((armorStatModId: EArmorStatModId) => {
		modHashes.push(getArmorStatMod(armorStatModId).hash);
	});

	const data: LoadoutParameters = {
		statConstraints: [
			{
				statHash: getArmorStat(EArmorStatId.Mobility).hash,
				minTier: stats.Mobility / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Resilience).hash,
				minTier: stats.Resilience / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Recovery).hash,
				minTier: stats.Recovery / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Discipline).hash,
				minTier: stats.Discipline / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Intellect).hash,
				minTier: stats.Intellect / 10 || null,
			},
			{
				statHash: getArmorStat(EArmorStatId.Strength).hash,
				minTier: stats.Strength / 10 || null,
			},
		],
		mods: modHashes,
		// // TODO: The no const enum thing is preventing me from using the dim api type AssumeArmorMasterwork
		assumeArmorMasterwork:
			masterworkAssumption === EMasterworkAssumption.All
				? 3
				: masterworkAssumption === EMasterworkAssumption.Legendary
				? 2
				: 1,
		exoticArmorHash: exoticArmor.hash,
	};

	const loadout: Loadout = {
		id: 'dlb', // this doesn't matter and will be replaced
		name: `${getDestinySubclass(destinySubclassId).name} ${
			exoticArmor.name
		} Loadout [DLB GENERATED]`,
		classType: DestinyClassIdToDestinyClassHash[destinyClassId],
		parameters: data,
		equipped: (armorList || []).map(({ hash, id }) => ({
			id,
			hash,
		})),
		unequipped: [],
		clearSpace: false,
	};

	console.log('>>>>>> LOADOUT', loadout);

	// Configure subclass
	const socketOverrides: Record<number, number> = {};

	socketOverrides[0] = getClassAbility(classAbilityId).hash;
	socketOverrides[1] = getJump(jumpId).hash;
	socketOverrides[2] = getSuperAbility(superAbilityId).hash;
	socketOverrides[3] = getMelee(meleeId).hash;
	socketOverrides[4] = getGrenade(grenadeId).hash;
	aspectHashes.forEach((hash, i) => {
		socketOverrides[i + 5] = hash;
	});
	fragmentHashes.forEach((hash, i) => {
		// Pull these socket indexes out
		socketOverrides[i + 7] = hash;
	});

	socketOverrides[2] = loadout.equipped.push({
		id: destinySubclassId, // This shouldn't need to be specified but right now it does. The value doesn't matter
		hash: getDestinySubclass(destinySubclassId).hash,
		socketOverrides,
	});

	const url =
		'https://beta.destinyitemmanager.com/loadouts?loadout=' +
		encodeURIComponent(JSON.stringify(loadout));

	return url;
};

export default generateDimLink;