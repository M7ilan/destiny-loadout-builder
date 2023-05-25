import { Button } from '@mui/material';
import { useRouter } from 'next/router';

function Logout() {
	const router = useRouter();
	const handleClick = () => {
		localStorage.removeItem('authorization');
		router.push('/login');
	};
	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={handleClick}
			sx={{ position: 'absolute', bottom: '16px', marginLeft: '8px' }}
		>
			Logout
		</Button>
	);
}

export default Logout;