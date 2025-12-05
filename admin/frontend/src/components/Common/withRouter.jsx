/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function withRouter(Component) {
	const ComponentWithRouterProp = (props) => {
		const location = useLocation();
		const navigate = useNavigate();
		const params = useParams();
		return <Component {...props} router={{ location, navigate, params }} />;
	};

	return ComponentWithRouterProp;
}

export default withRouter;
