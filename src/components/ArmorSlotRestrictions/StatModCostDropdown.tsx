import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SxProps,
	Theme,
	styled,
} from '@mui/material';
const Container = styled('div')(({ theme }) => ({
	// padding: theme.spacing(1),
	// paddingRight: 0
}));

type Option = {
	label: number;
	id: number;
};

/*
TODO:
I think this would be the processing pseudo logic
const requiredMods = getRequiredMods().sort() // Sort lowest cost to highest cost
const availableSlotCosts = [3,5,5,2,1].sort() // Sort lowest cost to highest cost
const neededSlots = availableSlotCosts.slice(-1 * requiredMods.length) // Get the highest cost slots that we will need
for (var i = 0; i < requiredMods.length; i ++ ) {
	if (requiredMods[i].cost > neededSlots[i]) {
		// This armor piece does not work for the loadout
	}
}
*/

const options: Option[] = [5, 4, 3, 2, 1, 0].map((statModCost) => {
	return {
		label: statModCost,
		id: statModCost,
	};
});

type StatModCostDropdownProps = {
	value: number;
	onChange: (value: number) => void;
	title?: string;
	selectComponentStyle?: SxProps<Theme>;
};

function StatModCostDropdown(props: StatModCostDropdownProps) {
	return (
		<Container>
			<FormControl fullWidth>
				<InputLabel id="icon-dropdown-select-label-2">
					{props.title || ''}
				</InputLabel>
				<Select
					sx={{
						...props.selectComponentStyle,
						maxWidth: 100,
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
						paddingTop: '8px',
						paddingBottom: '9px',
					}}
					labelId="icon-dropdown-select-label-2"
					id="icon-dropdown-select-2"
					className="icon-dropdown-select-2"
					value={props.value}
					label={props.title || ''}
					onChange={(e) => props.onChange(e.target.value as number)}
				>
					{options.map((option) => {
						return (
							<MenuItem key={option.id} value={option.id}>
								{option.label}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
		</Container>
	);
}

export default StatModCostDropdown;
