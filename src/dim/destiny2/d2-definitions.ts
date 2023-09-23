// import { d2ManifestSelector } from 'app/manifest/selectors';
// import { ThunkResult } from 'app/store/types';
// import { reportException } from 'app/utils/exceptions';
import { ItemCategoryHashes } from '@dlb/dim/data/d2/generated-enums';
import { getManifest } from '@dlb/dim/manifest/manifest-service-json';
import { warnLogCollapsedStack } from '@dlb/dim/utils/log';
import {
	AllDestinyManifestComponents,
	DestinyActivityDefinition,
	DestinyActivityModeDefinition,
	DestinyActivityModifierDefinition,
	DestinyBreakerTypeDefinition,
	DestinyClassDefinition,
	DestinyCollectibleDefinition,
	DestinyDamageTypeDefinition,
	DestinyDestinationDefinition,
	DestinyEnergyTypeDefinition,
	DestinyEventCardDefinition,
	DestinyFactionDefinition,
	DestinyGenderDefinition,
	DestinyInventoryBucketDefinition,
	DestinyInventoryItemDefinition,
	DestinyItemCategoryDefinition,
	DestinyItemTierTypeDefinition,
	DestinyLoadoutColorDefinition,
	DestinyLoadoutIconDefinition,
	DestinyLoadoutNameDefinition,
	DestinyMaterialRequirementSetDefinition,
	DestinyMetricDefinition,
	DestinyMilestoneDefinition,
	DestinyObjectiveDefinition,
	DestinyPlaceDefinition,
	DestinyPlugSetDefinition,
	DestinyPowerCapDefinition,
	DestinyPresentationNodeDefinition,
	DestinyProgressionDefinition,
	DestinyRaceDefinition,
	DestinyRecordDefinition,
	DestinySandboxPerkDefinition,
	DestinySeasonDefinition,
	DestinySeasonPassDefinition,
	DestinySocketCategoryDefinition,
	DestinySocketTypeDefinition,
	DestinyStatDefinition,
	DestinyStatGroupDefinition,
	DestinyTraitDefinition,
	DestinyVendorDefinition,
	DestinyVendorGroupDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import { ManifestDefinitions } from './definitions';

const lazyTables = [
	'InventoryItem',
	'Objective',
	'SandboxPerk',
	'Stat',
	'StatGroup',
	'EnergyType',
	'DamageType',
	'Progression',
	'ItemCategory',
	'Activity',
	'ActivityModifier',
	'Vendor',
	'SocketCategory',
	'SocketType',
	'MaterialRequirementSet',
	'Season',
	'SeasonPass',
	'Milestone',
	'Destination',
	'Place',
	'VendorGroup',
	'PlugSet',
	'Collectible',
	'PresentationNode',
	'Record',
	'Metric',
	'Trait',
	'PowerCap',
	'BreakerType',
	'EventCard',
	'LoadoutName',
	'LoadoutIcon',
	'LoadoutColor',
];

const eagerTables = [
	'InventoryBucket',
	'Class',
	'Gender',
	'Race',
	'Faction',
	'ItemTierType',
	'ActivityMode',
];

/** These aren't really lazy */
export interface DefinitionTable<T> {
	/**
	 * for troubleshooting/questionable lookups, include second arg
	 * and sentry can gather info about the source of the invalid hash.
	 * `requestor` ideally a string/number, or a definition including a "hash" key
	 */
	get(hash: number, requestor?: { hash: number } | string | number): T;
	getAll(): { [hash: number]: T };
}

export interface D2ManifestDefinitions extends ManifestDefinitions {
	InventoryItem: DefinitionTable<DestinyInventoryItemDefinition>;
	Objective: DefinitionTable<DestinyObjectiveDefinition>;
	SandboxPerk: DefinitionTable<DestinySandboxPerkDefinition>;
	Stat: DefinitionTable<DestinyStatDefinition>;
	StatGroup: DefinitionTable<DestinyStatGroupDefinition>;
	EnergyType: DefinitionTable<DestinyEnergyTypeDefinition>;
	Progression: DefinitionTable<DestinyProgressionDefinition>;
	ItemCategory: DefinitionTable<DestinyItemCategoryDefinition>;
	Activity: DefinitionTable<DestinyActivityDefinition>;
	ActivityModifier: DefinitionTable<DestinyActivityModifierDefinition>;
	Vendor: DefinitionTable<DestinyVendorDefinition>;
	SocketCategory: DefinitionTable<DestinySocketCategoryDefinition>;
	SocketType: DefinitionTable<DestinySocketTypeDefinition>;
	MaterialRequirementSet: DefinitionTable<DestinyMaterialRequirementSetDefinition>;
	Season: DefinitionTable<DestinySeasonDefinition>;
	SeasonPass: DefinitionTable<DestinySeasonPassDefinition>;
	Milestone: DefinitionTable<DestinyMilestoneDefinition>;
	Destination: DefinitionTable<DestinyDestinationDefinition>;
	Place: DefinitionTable<DestinyPlaceDefinition>;
	VendorGroup: DefinitionTable<DestinyVendorGroupDefinition>;
	PlugSet: DefinitionTable<DestinyPlugSetDefinition>;
	PresentationNode: DefinitionTable<DestinyPresentationNodeDefinition>;
	Record: DefinitionTable<DestinyRecordDefinition>;
	Metric: DefinitionTable<DestinyMetricDefinition>;
	Trait: DefinitionTable<DestinyTraitDefinition>;
	PowerCap: DefinitionTable<DestinyPowerCapDefinition>;
	BreakerType: DefinitionTable<DestinyBreakerTypeDefinition>;
	DamageType: DefinitionTable<DestinyDamageTypeDefinition>;
	Collectible: DefinitionTable<DestinyCollectibleDefinition>;
	EventCard: DefinitionTable<DestinyEventCardDefinition>;
	LoadoutName: DefinitionTable<DestinyLoadoutNameDefinition>;
	LoadoutColor: DefinitionTable<DestinyLoadoutColorDefinition>;
	LoadoutIcon: DefinitionTable<DestinyLoadoutIconDefinition>;

	InventoryBucket: { [hash: number]: DestinyInventoryBucketDefinition };
	Class: { [hash: number]: DestinyClassDefinition };
	Gender: { [hash: number]: DestinyGenderDefinition };
	Race: { [hash: number]: DestinyRaceDefinition };
	Faction: { [hash: number]: DestinyFactionDefinition };
	ItemTierType: { [hash: number]: DestinyItemTierTypeDefinition };
	ActivityMode: { [hash: number]: DestinyActivityModeDefinition };
}

export const allTables = [...eagerTables, ...lazyTables];

/**
 * Manifest database definitions. This returns a promise for an
 * object that has a property named after each of the tables listed
 * above (defs.TalentGrid, etc.).
 */
export async function getDefinitions(): Promise<D2ManifestDefinitions> {
	const manifest = await getManifest(allTables);
	const defs = buildDefinitionsFromManifest(manifest);
	return defs;
}

export function buildDefinitionsFromManifest(db: AllDestinyManifestComponents) {
	enhanceDBWithFakeEntries(db);
	const defs = {
		isDestiny2: () => true,
	};
	lazyTables.forEach((tableShort) => {
		const table =
			`Destiny${tableShort}Definition` as keyof AllDestinyManifestComponents;
		defs[tableShort] = {
			get(id: number, requestor?: { hash: number } | string | number) {
				const dbTable = db[table];
				if (!dbTable) {
					throw new Error(`Table ${table} does not exist in the manifest`);
				}
				const dbEntry = dbTable[id];
				if (!dbEntry && tableShort !== 'Record') {
					// there are valid negative hashes that we have added ourselves via enhanceDBWithFakeEntries,
					// but other than that they should be whole & reasonable sized numbers
					if (id < 1 || !Number.isSafeInteger(id)) {
						const requestingEntryInfo =
							typeof requestor === 'object' ? requestor.hash : requestor;
						// reportException('invalidHash', new HashLookupFailure(table, id), {
						//   requestingEntryInfo,
						//   failedHash: id,
						//   failedComponent: table,
						// });
					} else {
						warnLogCollapsedStack(
							'hashLookupFailure',
							`${table}[${id}]`,
							requestor
						);
					}
				}
				return dbEntry;
			},
			getAll() {
				return db[table];
			},
		};
	});
	// Resources that need to be fully loaded (because they're iterated over)
	eagerTables.forEach((tableShort) => {
		const table = `Destiny${tableShort}Definition`;
		defs[tableShort] = db[table];
	});

	return defs as D2ManifestDefinitions;
}

/** This adds fake entries to the DB for places where we've had to make stuff up. */
function enhanceDBWithFakeEntries(db: AllDestinyManifestComponents) {
	// We made up an item category for special grenade launchers. For now they can just be a copy
	// of the regular "Grenade Launcher" category but we could patch in localized descriptions if we wanted.
	db.DestinyItemCategoryDefinition[-ItemCategoryHashes.GrenadeLaunchers] = {
		...db.DestinyItemCategoryDefinition[ItemCategoryHashes.GrenadeLaunchers],
	};
}
