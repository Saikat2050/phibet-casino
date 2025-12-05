/* eslint-disable react/prop-types */
import React from 'react';
import VerticalBarChart from './VerticalPlayerChart';

const ActivePlayerChart = ({ statsData, layoutModeType, statsDataLoading }) => (
	<VerticalBarChart
		dataColors='["--bs-success", "--bs-primary", "--bs-danger","--bs-info", "--bs-warning"]'
		chartData={statsData}
		layoutModeType={layoutModeType}
		statsDataLoading={statsDataLoading}
	/>
);

export default ActivePlayerChart;
