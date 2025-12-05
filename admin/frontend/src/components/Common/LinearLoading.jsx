import * as React from 'react';
import { useSelector } from 'react-redux';

const LinearLoading = () => {
	const { showLinearProgress } = useSelector((state) => state.ProgressLoading);
	return showLinearProgress ? (
		// <Box sx={{ width: '100%', position: 'sticky', top: '70px', zIndex: '999' }}>
		// 	<LinearProgress />
		// </Box>
		<div />
	) : null;
};
export default LinearLoading;
