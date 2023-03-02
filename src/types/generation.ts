import { EModId } from '@dlb/generated/mod/EModId';
import { IIdentifiableName, IHash, IIcon, IBonuses } from './globals';
import {
	EElementId,
	EArmorSlotId,
	EDestinySubclassId,
	EModSocketCategoryId,
	EModCategoryId,
} from './IdEnums';

// Define the types/enums/interfaces used by generated files here

export interface IMod extends IIdentifiableName, IHash, IIcon, IBonuses {
	id: EModId;
	description: string;
	modSocketCategoryId: EModSocketCategoryId;
	modCategoryId: EModCategoryId;
	elementId?: EElementId; // TODO: Remove elementId
	cost: number;
	isArtifactMod: boolean;
	armorSlotId: EArmorSlotId | null;
	armorSocketIndex: number;
	elementOverlayIcon: string;
	similarModsAllowed: boolean;
}

export interface IAspect extends IIdentifiableName, IIcon, IHash {
	description: string;
	fragementSlots: number;
}

export interface IFragment extends IIdentifiableName, IIcon, IHash, IBonuses {
	description: string;
	elementId: EElementId;
}

export interface IGrenade extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
}

export interface IMelee extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}

export interface IClassAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}

export interface IJump extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}

export interface ISuperAbility extends IIdentifiableName, IIcon, IHash {
	description: string;
	elementId: EElementId;
	destinySubclassId: EDestinySubclassId;
}
