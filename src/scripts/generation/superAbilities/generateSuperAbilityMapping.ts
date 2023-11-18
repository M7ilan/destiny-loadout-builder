import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
import {
	formatStringForFile,
	getSerializableValue,
} from '@dlb/scripts/generation/utils';
import { ISuperAbility } from '@dlb/types/generation';
import { EDestinySubclassId, EElementId } from '@dlb/types/IdEnums';

export const generateSuperAbilityMapping = (
	superAbilities: ISuperAbility[]
): string => {
	const enumsToSerialize = {
		id: { enumDefinition: ESuperAbilityId, enumName: 'ESuperAbilityId' },
		elementId: { enumDefinition: EElementId, enumName: 'EElementId' },
		destinySubclassId: {
			enumDefinition: EDestinySubclassId,
			enumName: 'EDestinySubclassId',
		},
	};

	const serializeSuperAbilitys: Record<string, unknown>[] = [];
	superAbilities.forEach((superAbility) => {
		const serializedSuperAbility = { ...superAbility } as Record<
			string,
			unknown
		>;
		Object.keys(enumsToSerialize).forEach((key) => {
			const serializedResult = getSerializableValue(
				superAbility[key],
				enumsToSerialize[key].enumDefinition,
				enumsToSerialize[key].enumName
			);
			serializedSuperAbility[key] = serializedResult;
		});
		serializeSuperAbilitys.push(serializedSuperAbility);
	});

	const superAbilityIdToSuperAbilityMappingString = serializeSuperAbilitys.map(
		(superAbility) =>
			`[${superAbility.id}]: ${JSON.stringify(superAbility, null, 2)},`
	);

	const setDataFileSource = `// This file is generated by the generateSuperAbilityMapping.ts script.
	// Do not manually make changes to this file.

	import { EnumDictionary } from '@dlb/types/globals';
	import { ISuperAbility } from '@dlb/types/generation';
  import { ESuperAbilityId } from '@dlb/generated/superAbility/ESuperAbilityId';
	import { EElementId, EDestinySubclassId } from '@dlb/types/IdEnums';

	export const SuperAbilityIdToSuperAbilityMapping: EnumDictionary<ESuperAbilityId, ISuperAbility> = {
		${superAbilityIdToSuperAbilityMappingString.join(' ')}
	}
	`;
	return formatStringForFile(setDataFileSource);
};
