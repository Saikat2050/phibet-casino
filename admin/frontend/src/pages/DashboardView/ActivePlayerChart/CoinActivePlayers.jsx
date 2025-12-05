/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import PropTypes from 'prop-types';
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';
import Spinners from '../../../components/Common/Spinner';

const CoinActivePlayers = ({
	statsData,
	// layoutModeType,
	statsDataLoading,
}) => {
	const chartColors = getChartColorsArray(
		'["--bs-success", "--bs-primary", "--bs-danger"]'
	);
	const [series, setSeries] = useState([]);
	const [xAxis, setxAxis] = useState([]);

	useEffect(() => {
		if (statsData?.dates?.length) {
			const formattedData = [
				{
					name: 'Active SC Players',
					data: statsData.activePlayerStats.activeSCPlayers,
				},
				{
					name: 'Active GC Players',
					data: statsData.activePlayerStats.activeGCPlayers,
				},
				{
					name: 'Active New SC Players',
					data: statsData.activePlayerStats.activeNewSCPlayers,
				},
			];

			setSeries(formattedData);
			setxAxis(
				statsData.dates.map((date) => moment(date).format('D MMM YYYY'))
			);
		}
	}, [statsData]);

	const options = {
		chart: { type: 'line', zoom: { enabled: false }, toolbar: { show: false } },
		colors: chartColors,
		dataLabels: { enabled: false },
		stroke: { show: true, width: 3, curve: 'smooth' },
		xaxis: {
			categories: xAxis,
		},
		yaxis: {
			labels: {
				formatter: (value) => `${value}`,
				style: {
					fontWeight: 'bold',
				},
			},
		},
		tooltip: {
			y: {
				formatter(value) {
					return `${value}`;
				},
			},
		},
		grid: { borderColor: '#f1f1f1' },
	};

	return statsDataLoading ? (
		<div style={{ height: '380px' }}>
			<Spinners />
		</div>
	) : (
		<ReactApexChart
			options={options}
			series={series}
			type="line"
			height="380"
			className="apex-charts"
		/>
	);
};

export default CoinActivePlayers;

CoinActivePlayers.propTypes = {
	statsDataLoading: PropTypes.bool,
	statsData: PropTypes.shape({
		dates: PropTypes.arrayOf(PropTypes.string),
		activePlayerStats: PropTypes.shape({
			activeSCPlayers: PropTypes.arrayOf(PropTypes.number),
			activeGCPlayers: PropTypes.arrayOf(PropTypes.number),
			activeNewSCPlayers: PropTypes.arrayOf(PropTypes.number),
		}),
	}),
};

CoinActivePlayers.defaultProps = {
	statsDataLoading: false,
	statsData: {
		dates: [],
		activePlayerStats: {
			activeSCPlayers: [],
			activeGCPlayers: [],
			activeNewSCPlayers: [],
		},
	},
};
