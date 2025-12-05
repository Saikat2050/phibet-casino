/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import moment from 'moment';
import React, { useMemo } from 'react';
import ApexCharts from 'react-apexcharts';
import { addCommasToNumber } from '../../../utils/helpers';
import Spinners from '../../../components/Common/Spinner';

const CarbonLineBarChart = ({
	chartData,
	// layoutModeType,
	statsDataLoading,
}) => {
	const { dateSeries, series } = useMemo(() => {
		if (!chartData?.dates) {
			return { dateSeries: [], series: [] };
		}

		return {
			dateSeries: chartData.dates.map((date) => moment(date).format('ll')),
			series: [
				{
					name: 'GC Purchase Coins',
					data: chartData.purchaseStats.gcAmount,
				},
				{
					name: 'SC Purchase Coins',
					data: chartData.purchaseStats.scAmount,
				},
				{
					name: 'Total Purchase Amount',
					data: chartData.purchaseStats.totalPurchaseAmount,
				},
				// {
				// 	name: 'Total Purchase Amount',
				// 	data: chartData.purchaseStats.totalAmount,
				// },
				// {
				// 	name: 'Total Purchase Count',
				// 	data: chartData.purchaseStats.scCount,
				// },
			],
		};
	}, [chartData]);

	const baseChartOptions = {
		chart: {
			type: 'line',
			height: 350,
			stacked: true,
			toolbar: { show: false },
			zoom: { enabled: true },
		},
		plotOptions: {
			bar: {
				horizontal: false,
				borderRadius: 6,
				borderRadiusApplication: 'end',
				borderRadiusWhenStacked: 'last',
				borderWidth: 2,
				borderColor: '#000',
			},
		},
		dataLabels: { enabled: false },
		legend: { position: 'bottom', offsetY: 10 },
		fill: { opacity: 0.7 },
		tooltip: {
			y: {
				formatter: (val, { seriesIndex }) =>
					seriesIndex === 0 ? Math.floor(val) : val,
			},
		},
	};

	const chartOptions = {
		...baseChartOptions,
		colors: [
			'rgba(67, 247, 200, 0.9)',
			'#9b734c',
			'rgba(7, 102, 75, 0.9)',
			'#57392b',
		],
		xaxis: { categories: dateSeries },
	};

	return (
		<div id="chart">
			<div className="d-flex justify-content-start flex-wrap gap-3">
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-success">GC Purchase Coins:</span>{' '}
						{addCommasToNumber(
							chartData.purchaseStats.gcAmount.reduce(
								(acc, val) => acc + val,
								0
							),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-info-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#57392b' }}>SC Purchase Coins:</span>{' '}
						{addCommasToNumber(
							chartData.purchaseStats.scAmount.reduce(
								(acc, val) => acc + val,
								0
							),
							2
						)}
					</h6>
				</div>
				<div className="badge bg-success-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span className="text-success">Total Purchase Amount:</span>{' '}
						{addCommasToNumber(
							chartData.purchaseStats.totalPurchaseAmount
								.reduce((acc, val) => acc + val, 0)
								.toFixed(2)
						)}
					</h6>
				</div>
				<div className="badge bg-info-subtle text-dark p-3 fs-4 rounded-4">
					<h6 className="mb-0 font-weight-bold">
						<span style={{ color: '#9b734c' }}>Total Purchase Count:</span>{' '}
						{addCommasToNumber(
							chartData.purchaseStats.scCount.reduce((acc, val) => acc + val, 0)
						)}
					</h6>
				</div>
			</div>
			{statsDataLoading ? (
				<div style={{ height: '350px' }}>
					<Spinners />
				</div>
			) : (
				<ApexCharts
					options={chartOptions}
					series={series}
					type="bar"
					height={350}
				/>
			)}
		</div>
	);
};

export default CarbonLineBarChart;
