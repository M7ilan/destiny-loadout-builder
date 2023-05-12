import BungieImage from '@dlb/dim/dim-ui/BungieImage';
import { IArmorStat } from '@dlb/types/ArmorStat';
import { getElement } from '@dlb/types/Element';
import { EElementId } from '@dlb/types/IdEnums';
import { MISSING_ICON, StatBonus, StatBonusStat } from '@dlb/types/globals';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {
	Avatar,
	Box,
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	styled,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Container = styled(Box)(({ theme }) => ({
	//color: theme.palette.primary.main,
	padding: theme.spacing(1),
	// display: 'flex',
	// justifyContent: 'left',
}));

const MenuItemContent = styled('div')(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexWrap: 'nowrap',
}));

const MenuItemRow = styled('div')(({ theme }) => ({
	flex: 1,
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'nowrap',
	// textTransform: 'capitalize'
}));

const MenuItemText = styled('div')(({ theme }) => ({
	marginLeft: theme.spacing(1),
	whiteSpace: 'initial',
	// textTransform: 'capitalize'
}));

const Tag = styled(Box)(({ theme }) => ({
	padding: theme.spacing(1),
	display: 'flex',
	justifyContent: 'left',
	alignItems: 'center',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
	color: theme.palette.secondary.main,
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			// maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			// maxHeight: '70vh',
			width: 250,
		},
	},
};

interface IOption {
	name: string;
	id: string;
	icon: string;
	description: string;
	bonuses?: StatBonus[];
	elementId: EElementId;
}

type IIconMultiSelectDropdownProps = {
	options: string[];
	value: string[];
	onChange: (value: string[]) => void;
	// getName: (value: IIconMultiSelectDropdownOption) => string
	title: string;
	id: string;
	getOptionValue: (id: string) => IOption;
	getOptionStat: (stat: StatBonusStat) => IArmorStat;
	showElement?: boolean;
	disabled?: boolean;
	maxSelectionCount?: number;
};

const PLACEHOLDER_OPTION = 'None Selected...';

export default function IconMultiSelectDropdown({
	options,
	value,
	onChange,
	title,
	id,
	getOptionValue,
	getOptionStat,
	showElement,
	disabled,
	maxSelectionCount,
}: IIconMultiSelectDropdownProps) {
	const handleChange = (event: SelectChangeEvent<string[]>) => {
		const {
			target: { value },
		} = event;
		// On autofill we get a stringified value.
		// typeof value === 'string' ? value.split(',') : value,
		onChange((value as string[]).filter((id) => id != PLACEHOLDER_OPTION));
	};

	return (
		<FormControl fullWidth>
			<InputLabel id={title}>{title}</InputLabel>
			<Select
				disabled={disabled}
				SelectDisplayProps={{ style: { paddingLeft: 6 } }}
				MenuProps={MenuProps}
				multiple
				value={value.length > 0 ? value : [PLACEHOLDER_OPTION]}
				id={id}
				title={title}
				label={title}
				labelId={title}
				onChange={handleChange}
				renderValue={(options) => {
					if (options.length === 1 && options[0] === PLACEHOLDER_OPTION) {
						return (
							<Tag>
								<BungieImage src={MISSING_ICON} width={'40px'} />
								<MenuItemText>
									{disabled
										? 'Subclass Selection Required...'
										: 'None Selected...'}
								</MenuItemText>
							</Tag>
						);
					}
					return options.map((id) => {
						const optionValue = getOptionValue(id);
						return (
							<Tag
								//onClick={(e) => onDelete(e)}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'left',
									alignItems: 'left',
									flexWrap: 'wrap',
									paddingTop: '8px',
									paddingBottom: '0px',
									'&:nth-of-type(even)': {
										background: 'rgba(50,50,50,0.5)',
									},
								}}
								key={optionValue.id}
							>
								<Box sx={{ display: 'flex', marginBottom: '8px' }}>
									<BungieImage src={optionValue.icon} width={'40px'} />
									<MenuItemText sx={{ lineHeight: '40px' }}>
										{optionValue.name}
									</MenuItemText>
								</Box>
								<Box sx={{ height: '40px', marginBottom: '2px' }}>
									{optionValue.bonuses && optionValue.bonuses.length > 0 && (
										<MenuItemRow>
											{optionValue.bonuses.map(({ stat, value }) => {
												const { icon: statIcon, id: statId } =
													getOptionStat(stat);
												return (
													<Chip
														style={{ marginLeft: '8px', marginTop: '2px' }}
														key={statId}
														avatar={<Avatar alt={'stat-icon'} src={statIcon} />}
														label={value > 0 ? `+${value}` : value}
													/>
												);
											})}
										</MenuItemRow>
									)}
								</Box>
							</Tag>
						);
					});
				}}
				style={{ width: '100%' }}
			>
				{options.map((id) => {
					const optionValue = getOptionValue(id);
					const isChecked = value.indexOf(id) > -1;
					return (
						<MenuItem
							key={optionValue.id}
							value={optionValue.id}
							disabled={
								!isChecked &&
								maxSelectionCount &&
								value.length >= maxSelectionCount
							}
							//style={getStyles(name, personName, theme)}
						>
							<MenuItemContent>
								<MenuItemRow>
									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={isChecked}
									/>
									<BungieImage width={40} height={40} src={optionValue.icon} />
									<MenuItemText>{optionValue.name}</MenuItemText>
									{showElement && (
										<BungieImage
											style={{ marginLeft: '6px' }}
											width={20}
											height={20}
											src={getElement(optionValue.elementId).icon}
										/>
									)}
								</MenuItemRow>
								<MenuItemRow style={{ paddingTop: 8 }}>
									<MenuItemText>{optionValue.description}</MenuItemText>
								</MenuItemRow>
								{optionValue.bonuses && optionValue.bonuses.length > 0 && (
									<MenuItemRow style={{ paddingTop: 8 }}>
										<MenuItemText>Bonuses:</MenuItemText>
										{optionValue.bonuses.map(({ stat, value }) => {
											const { icon: statIcon, id: statId } =
												getOptionStat(stat);
											return (
												<Chip
													style={{ marginLeft: '8px' }}
													key={statId}
													avatar={<Avatar alt={'stat-icon'} src={statIcon} />}
													label={value > 0 ? `+${value}` : value}
												/>
											);
										})}
									</MenuItemRow>
								)}
							</MenuItemContent>
						</MenuItem>
					);
				})}
			</Select>
		</FormControl>
	);
}
