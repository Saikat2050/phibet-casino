import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import withRouter from './Common/withRouter';
import { getAccessToken } from '../network/storageUtils';

const NonAuthLayout = ({ children }) => {
	const accessToken = getAccessToken();

	if (accessToken) {
		return <Navigate to={{ pathname: '/dashboard' }} />;
	}
	return children;
};

NonAuthLayout.propTypes = {
	children: PropTypes.element.isRequired,
};

export default withRouter(NonAuthLayout);
