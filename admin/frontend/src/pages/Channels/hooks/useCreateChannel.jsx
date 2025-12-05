import React from 'react';
import { useLocation } from 'react-router-dom';
import General from '../FormSections/General';

const useCreateChannel = () => {
	const location = useLocation();

	const channelDetails = location?.state?.channelDetails;

	const tabData = [
		{
			id: 'general',
			title: 'Create New Channel',
			component: <General channelDetails={channelDetails} />,
		},
	];

	return {
		tabData,
		activeTab: 'general',
	};
};

export default useCreateChannel;
