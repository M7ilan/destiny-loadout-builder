import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
import {
	formatStringForFile,
	getSerializableObject,
} from '@dlb/scripts/generation/utils';
import { IGrenade } from '@dlb/types/generation';
import { EElementId } from '@dlb/types/IdEnums';

export const generateGrenadeMapping = (grenades: IGrenade[]): string => {
	const enumsToSerialize = {
		// armorSlotId: { enumDefinition: EArmorSlotId, enumName: 'EArmorSlotId' },
		id: { enumDefinition: EGrenadeId, enumName: 'EGrenadeId' },
		elementId: { enumDefinition: EElementId, enumName: 'EElementId' },
	};

	const serializeGrenades: Record<string, unknown>[] = [];
	grenades.forEach((grenade) => {
		const serializedGrenade = { ...grenade } as Record<string, unknown>;
		// TODO: This is dumb. We shouldn't serialize the whole object. Just the key/value pair that we need per iteration
		Object.keys(enumsToSerialize).forEach((key) => {
			const serializedResult = getSerializableObject(
				serializedGrenade,
				key,
				enumsToSerialize[key].enumDefinition,
				enumsToSerialize[key].enumName
			) as Record<string, unknown>;
			serializedGrenade[key] = serializedResult[key];
		});
		serializeGrenades.push(serializedGrenade);
	});

	const grenadeIdToGrenadeMappingString = serializeGrenades.map(
		(grenade) => `[${grenade.id}]: ${JSON.stringify(grenade, null, 2)},`
	);

	const setDataFileSource = `// This file is generated by the generateGrenadeMapping.ts script.
	// Do not manually make changes to this file.

	import { EnumDictionary } from '@dlb/types/globals';
	import { IGrenade } from '@dlb/types/generation';
  import { EGrenadeId } from '@dlb/generated/grenade/EGrenadeId';
	import { EElementId } from '@dlb/types/IdEnums';

	export const GrenadeIdToGrenadeMapping: EnumDictionary<EGrenadeId, IGrenade> = {
		${grenadeIdToGrenadeMappingString.join(' ')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
