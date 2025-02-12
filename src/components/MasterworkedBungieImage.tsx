'use client';

import BungieImage, { BungieImageProps } from '@dlb/dim/dim-ui/BungieImage';
import { Box, styled } from '@mui/material';

const Container = styled(Box, {
	shouldForwardProp: (prop) => prop !== 'isMasterworked',
})<{ isMasterworked?: boolean }>(({ theme, isMasterworked }) => ({
	border: isMasterworked ? '1px solid gold' : '1px solid white',
}));

type MasterworkedBungieImageProps = BungieImageProps & {
	isMasterworked: boolean;
	width: number;
	height: number;
};

function MasterworkedBungieImage(props: MasterworkedBungieImageProps) {
	const { isMasterworked, width, height, ...rest } = props;
	return (
		<Container
			isMasterworked={isMasterworked}
			sx={{
				width: `calc(${width}px + 2px)`,
				height: `calc(${height}px + 2px)`,
			}}
		>
			<BungieImage width={width} height={height} {...rest} />
		</Container>
	);
}

export default MasterworkedBungieImage;
