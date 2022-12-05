import { styled, Box } from '@mui/material';
import { Mark } from './StatSelection';

type StatSelectorRowProps = {
	marks: Mark[];
	onChange: (value: number) => void;
	value: number;
};

const Container = styled(Box)(({ theme }) => ({
	color: theme.palette.secondary.main,
	display: 'flex',
	width: '100%',
}));

const TierBlock = styled(Box, {
	shouldForwardProp: (prop) =>
		!['filled', 'first', 'last'].includes(prop as string),
})<{ filled?: boolean; first: boolean; last: boolean }>(
	({ theme, color, filled, first, last }) => ({
		flex: '1 1 0px', //Ensure all the same width
		width: 0,
		paddingLeft: '3px',
		paddingRight: '3px',
		paddingTop: '6px',
		paddingBottom: '6px',
		textAlign: 'center',
		cursor: 'pointer',
		background: filled ? 'white' : 'black',
		borderTopLeftRadius: first ? '4px' : '',
		borderBottomLeftRadius: first ? '4px' : '',
		borderTopRightRadius: last ? '4px' : '',
		borderBottomRightRadius: last ? '4px' : '',
		borderTop: '1px solid',
		borderBottom: '1px solid',
		borderLeft: first ? '1px solid' : '',
		borderRight: '1px solid',
		borderColor: filled ? 'white' : 'rgb(128, 128, 128)',
		color: filled ? 'black' : '',
		borderRightColor: filled && !last ? 'black' : '',
	})
);

function StatSelectorRow(props: StatSelectorRowProps) {
	const { marks, value, onChange } = props;

	return (
		<>
			<Container>
				{marks.map((mark, i) => (
					<TierBlock
						first={i === 0}
						last={i === marks.length - 1}
						filled={mark.value <= value}
						key={mark.value}
						onClick={() => onChange(mark.value)}
					>
						{mark.label}
					</TierBlock>
				))}
			</Container>
		</>
	);
}

export default StatSelectorRow;