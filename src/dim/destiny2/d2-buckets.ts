import { BucketHashes } from '@dlb/dim/data/d2/generated-enums';
import type {
	D2BucketCategory,
	DimBucketType,
	InventoryBucket,
	InventoryBuckets,
} from '@dlb/dim/inventory/inventory-buckets';
import { VENDORS } from '@dlb/dim/search/d2-known-values';
import {
	BucketCategory,
	DestinyInventoryBucketDefinition,
} from 'bungie-api-ts-no-const-enum/destiny2';
import _ from 'lodash';
import { D2Categories } from './d2-bucket-categories';
import { D2ManifestDefinitions } from './d2-definitions';

// A mapping from the bucket hash to DIM item types
const bucketToTypeRaw = {
	[BucketHashes.EnergyWeapons]: 'Energy',
	[BucketHashes.UpgradePoint]: 'UpgradePoint',
	[BucketHashes.StrangeCoin]: 'StrangeCoin',
	[BucketHashes.Glimmer]: 'Glimmer',
	[BucketHashes.LegendaryShards]: 'Legendary Shards',
	[BucketHashes.Silver]: 'Silver',
	[BucketHashes.BrightDust]: 'Bright Dust',
	[BucketHashes.Messages]: 'Messages',
	[BucketHashes.Subclass]: 'Class',
	[BucketHashes.Modifications]: 'Modifications',
	[BucketHashes.Helmet]: 'Helmet',
	[BucketHashes.Gauntlets]: 'Gauntlets',
	[BucketHashes.Materials]: 'Materials',
	[BucketHashes.Ghost]: 'Ghost',
	[BucketHashes.Emblems]: 'Emblems',
	[BucketHashes.ChestArmor]: 'Chest',
	[BucketHashes.LegArmor]: 'Leg',
	[BucketHashes.LostItems]: 'LostItems',
	[BucketHashes.Ships]: 'Ships',
	[BucketHashes.Engrams]: 'Engrams',
	[BucketHashes.PowerWeapons]: 'Power',
	[BucketHashes.Auras]: 'Auras',
	[BucketHashes.SpecialOrders]: 'SpecialOrders',
	[BucketHashes.KineticWeapons]: 'KineticSlot',
	[BucketHashes.ClassArmor]: 'ClassItem',
	[BucketHashes.Vehicle]: 'Vehicle',
	[BucketHashes.Consumables]: 'Consumables',
	[BucketHashes.General]: 'General',
	[BucketHashes.Emotes_Invisible]: 'Emotes',
	[BucketHashes.Quests]: 'Pursuits',
	[BucketHashes.SeasonalArtifact]: 'SeasonalArtifacts',
	[BucketHashes.Finishers]: 'Finishers',
	[BucketHashes.ClanBanners]: 'ClanBanner',
} as const;

export type D2BucketTypes =
	typeof bucketToTypeRaw[keyof typeof bucketToTypeRaw];

// these don't have bucket hashes but may be manually assigned to DimItems
export type D2AdditionalBucketTypes = 'Milestone' | 'Unknown';

// A mapping from the bucket hash to DIM item types
export const bucketToType: {
	[hash: number]: DimBucketType | undefined;
} = bucketToTypeRaw;

const bucketHashToSort: { [bucketHash: number]: D2BucketCategory } = {};
_.forIn(D2Categories, (bucketHashes, category: D2BucketCategory) => {
	bucketHashes.forEach((bucketHash) => {
		bucketHashToSort[bucketHash] = category;
	});
});

export function getBuckets(defs: D2ManifestDefinitions) {
	const buckets: InventoryBuckets = {
		byHash: {},
		byCategory: {},
		unknown: {
			description: 'Unknown items. DIM needs a manifest update.',
			name: 'Unknown',
			hash: -1,
			hasTransferDestination: false,
			capacity: Number.MAX_SAFE_INTEGER,
			sort: 'Unknown',
			type: 'Unknown',
			accountWide: false,
			category: BucketCategory.Item,
		},
		setHasUnknown() {
			this.byCategory[this.unknown.sort] = [this.unknown];
		},
	};
	_.forIn(
		defs.InventoryBucket.getAll(),
		(def: DestinyInventoryBucketDefinition) => {
			const type = bucketToType[def.hash];
			const sort = bucketHashToSort[def.hash];
			const bucket: InventoryBucket = {
				description: def.displayProperties.description,
				name: def.displayProperties.name,
				hash: def.hash,
				hasTransferDestination: def.hasTransferDestination,
				capacity: def.itemCount,
				accountWide: def.scope === 1,
				category: def.category,
				type,
				sort,
			};
			// Add an easy helper property like "inPostmaster"
			if (bucket.sort) {
				bucket[`in${bucket.sort}`] = true;
			}
			buckets.byHash[bucket.hash] = bucket;
		}
	);
	const vaultMappings = {};
	defs.Vendor.get(VENDORS.VAULT).acceptedItems.forEach((items) => {
		vaultMappings[items.acceptedInventoryBucketHash] =
			items.destinationInventoryBucketHash;
	});
	_.forIn(buckets.byHash, (bucket: InventoryBucket) => {
		if (vaultMappings[bucket.hash]) {
			bucket.vaultBucket = buckets.byHash[vaultMappings[bucket.hash]];
		}
	});
	_.forIn(D2Categories, (bucketHashes, category) => {
		buckets.byCategory[category] = _.compact(
			bucketHashes.map((bucketHash) => buckets.byHash[bucketHash])
		);
	});
	return buckets;
}
