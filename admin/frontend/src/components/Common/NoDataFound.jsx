import React from 'react';
import { Card } from 'reactstrap';
import PropTypes from 'prop-types';
import noDataFound from '../../assets/images/noDataFound.png';

const NoDataFound = ({ height, width }) => (
	<Card className="p-5 d-flex align-items-center">
		<img src={noDataFound} alt="No Data Found" width={width} height={height} />
	</Card>
);

NoDataFound.defaultProps = {
	height: '',
	width: '',
};

NoDataFound.propTypes = {
	height: PropTypes.string,
	width: PropTypes.string,
};

export default NoDataFound;
