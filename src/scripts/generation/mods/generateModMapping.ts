import { EArmorSlotId, EElementId } from '@dlb/types/IdEnums';
import { IMod } from '@dlb/types/generation';
import { EModId } from '@dlb/generated/mod/EModId';
import {
	formatStringForFile,
	getSerializableObject,
} from '@dlb/scripts/generation/utils';

export const generateModMapping = (mods: IMod[]): string => {
	const enumsToSerialize = {
		armorSlotId: { enumDefinition: EArmorSlotId, enumName: 'EArmorSlotId' },
		id: { enumDefinition: EModId, enumName: 'EModId' },
		elementId: { enumDefinition: EElementId, enumName: 'EElementId' },
	};

	const serializeMods: Record<string, unknown>[] = [];
	mods.forEach((mod) => {
		const serializedMod = { ...mod } as Record<string, unknown>;
		// TODO: This is dumb. We shouldn't serialize the whole object. Just the key/value pair that we need per iteration
		Object.keys(enumsToSerialize).forEach((key) => {
			const serializedResult = getSerializableObject(
				serializedMod,
				key,
				enumsToSerialize[key].enumDefinition,
				enumsToSerialize[key].enumName
			) as Record<string, unknown>;
			serializedMod[key] = serializedResult[key];
		});
		serializeMods.push(serializedMod);
	});

	const modIdToModMappingString = serializeMods.map(
		(mod) => `[${mod.id}]: ${JSON.stringify(mod, null, 2)},`
	);

	const setDataFileSource = `// This file is generated by the generateMods.ts script.
	// Do not manually make changes to this file.

	import { EnumDictionary } from '@dlb/types/globals';
	import { IMod } from '@dlb/types/generation';
  import { EModId } from '@dlb/generated/mod/EModId';
  import { EArmorSlotId, EElementId } from "@dlb/types/IdEnums";

	export const ModIdToModMapping: EnumDictionary<EModId, IMod> = {
		${modIdToModMappingString.join(' ')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};