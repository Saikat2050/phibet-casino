/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import PropTypes from 'prop-types';
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor';
import { formatInKMB } from '../../../utils/helpers';
import Spinners from '../../../components/Common/Spinner';

const RevenueChart = ({ statsData, statsDataLoading }) => {
	const chartColors = getChartColorsArray(
		'["--bs-success", "--bs-primary", "--bs-danger"]'
	);
	const [series, setSeries] = useState([]);
	const [xAxis, setxAxis] = useState([]);

	useEffect(() => {
		const formateData = [
			{
				name: 'SC Revenue',
				data: statsData.revenueStats.scRevenue,
			},
			{
				name: 'SC Wagered',
				data: statsData.revenueStats.scWagered,
			},
			{
				name: 'SC Payout',
				data: statsData.revenueStats.scPayout,
			},
			{
				name: 'GC Revenue',
				data: statsData.revenueStats.gcRevenue,
			},
			{
				name: 'GC Wagered',
				data: statsData.revenueStats.gcWagered,
			},
			{
				name: 'GC Payout',
				data: statsData.revenueStats.gcPayout,
			},
		];

		setSeries(formateData);
		setxAxis(statsData.dates.map((date) => moment(date).format('D MMM YYYY')));
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
				formatter: (value) => `${formatInKMB(value) || ''}`,
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

export default RevenueChart;

RevenueChart.defaultProps = {
	statsDataLoading: false,
	statsData: {
		revenueStats: {
			scRevenue: [],
			scWagered: [],
			scPayout: [],
			gcRevenue: [],
			gcWagered: [],
			gcPayout: [],
		},
		dates: [],
	},
};

RevenueChart.propTypes = {
	statsDataLoading: PropTypes.bool,
	statsData: PropTypes.shape({
		revenueStats: PropTypes.shape({
			scRevenue: PropTypes.arrayOf(PropTypes.number),
			scWagered: PropTypes.arrayOf(PropTypes.number),
			scPayout: PropTypes.arrayOf(PropTypes.number),
			gcRevenue: PropTypes.arrayOf(PropTypes.number),
			gcWagered: PropTypes.arrayOf(PropTypes.number),
			gcPayout: PropTypes.arrayOf(PropTypes.number),
		}),
		dates: PropTypes.arrayOf(PropTypes.string),
	}),
};
